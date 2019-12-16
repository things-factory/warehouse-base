import { getPermittedBizplaceIds } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'
import { convertListParams, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { INVENTORY_STATUS } from '../../../constants/inventory'
import { Inventory } from '../../../entities'

export const inventoriesByProduct = {
  async inventoriesByProduct(_: any, params: ListParam, context: any) {
    const convertedParams = convertListParams({
      filters: [
        ...params.filters,
        {
          name: 'bizplace',
          operator: 'in',
          value: await getPermittedBizplaceIds(context.state.domain, context.state.user)
        }
      ]
    })

    const products = await getRepository(Product).find({
      ...convertedParams
    })

    const page = params.pagination.page
    const limit = params.pagination.limit

    const queryBuilder = getRepository(Product).createQueryBuilder()
    queryBuilder
      .select('Product.id', 'id')
      .addSelect('Product.name', 'name')
      .addSelect('Product.description', 'description')
      .addSelect('Product.weight', 'weight')
      .addSelect('Product.unit', 'unit')
      .addSelect('Product.type', 'type')
      .addSelect('ProductRef.name', 'productRefName')
      .addSelect('ProductRef.description', 'productRefDesciption')
      .addSelect('SUM(Inventory.qty)', 'qty')
      .leftJoin('Product.productRef', 'ProductRef')
      .leftJoin(Inventory, 'Inventory', 'Inventory.product_id = Product.id')
      .where('qty >= :qty', { qty: 0 })
      // .where('Inventory.status = :status', { status: INVENTORY_STATUS.STORED })
      .offset((page - 1) * limit)
      .limit(limit)
      .groupBy('Product.id')
      .addGroupBy('ProductRef.id')

    if (products && products.length) {
      queryBuilder.andWhereInIds(products.map((product: Product) => product.id))
    } else {
      queryBuilder.andWhereInIds([null])
    }

    const items = await queryBuilder.getRawMany()
    const total = await queryBuilder.getCount()

    return {
      items: items.map((item: any) => {
        return {
          product: {
            id: item.id,
            name: item.name,
            description: item.description,
            type: item.type,
            weight: item.weight,
            unit: item.unit,
            productRef: { name: item.productRefName, description: item.productRefDesciption }
          },
          qty: item.qty
        }
      }),
      total
    }
  }
}

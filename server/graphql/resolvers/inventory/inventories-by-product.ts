import { getPermittedBizplaceIds } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'
import { convertListParams, ListParam } from '@things-factory/shell'
import { getRepository, SelectQueryBuilder } from 'typeorm'
import { Inventory } from '../../../entities'

export const inventoriesByProduct = {
  async inventoriesByProduct(_: any, params: ListParam, context: any) {
    let products: Product[]
    const permittedBizplaceIds: string[] = await getPermittedBizplaceIds(context.state.domain, context.state.user)

    if (params?.filters?.length) {
      const convertedParams = convertListParams({
        filters: [
          ...params.filters,
          {
            name: 'bizplace',
            operator: 'in',
            value: permittedBizplaceIds
          }
        ]
      })

      products = await getRepository(Product).find(convertedParams)
    }

    const page = params.pagination.page
    const limit = params.pagination.limit

    const selectQueryBuilder: SelectQueryBuilder<Inventory> = getRepository(Inventory).createQueryBuilder()
    const countQueryBuilder: SelectQueryBuilder<Inventory> = getRepository(Inventory).createQueryBuilder()
    selectQueryBuilder
      .select('Product.id', 'id')
      .addSelect('Product.name', 'name')
      .addSelect('Product.description', 'description')
      .addSelect('Product.weight', 'weight')
      .addSelect('Product.type', 'type')
      .addSelect('ProductRef.name', 'productRefName')
      .addSelect('ProductRef.description', 'productRefDesciption')
      .addSelect('SUM(Inventory.qty)', 'qty')
      .leftJoin('Inventory.product', 'Product')
      .leftJoin('Product.productRef', 'ProductRef')
      .where('Inventory.qty >= :qty', { qty: 0 })
      .andWhere('Inventory.domain_id = :domainId', { domainId: context.state.domain.id })
      .andWhere('Inventory.bizplace_id IN (:...bizplaceIds)', { bizplaceIds: permittedBizplaceIds })
      .offset((page - 1) * limit)
      .limit(limit)
      .groupBy('Product.id')
      .addGroupBy('ProductRef.id')

    countQueryBuilder
      .select('COUNT(DISTINCT("Inventory"."product_id"))', 'total')
      .leftJoin('Inventory.product', 'Product')
      .leftJoin('Product.productRef', 'ProductRef')
      .where('Inventory.qty >= :qty', { qty: 0 })
      .andWhere('Inventory.domain_id = :domainId', { domainId: context.state.domain.id })
      .andWhere('Inventory.bizplace_id IN (:...bizplaceIds)', { bizplaceIds: permittedBizplaceIds })

    if (products) {
      let productIds: string[] = products.map((product: Product) => product.id)
      if (productIds.length === 0) {
        productIds = [null]
      }

      selectQueryBuilder.andWhere('Product.id IN (:...productIds)', { productIds })
      countQueryBuilder.andWhere('Product.id IN (:...productIds)', { productIds })
    }

    const items = await selectQueryBuilder.getRawMany()
    const { total } = await countQueryBuilder.getRawOne()

    return {
      items: items.map((item: any) => {
        return {
          product: {
            id: item.id,
            name: item.name,
            description: item.description,
            type: item.type,
            weight: item.weight,
            productRef: { name: item.productRefName, description: item.productRefDesciption }
          },
          qty: item.qty
        }
      }),
      total: Number(total)
    }
  }
}
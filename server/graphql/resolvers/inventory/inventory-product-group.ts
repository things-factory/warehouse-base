import { Bizplace, getMyBizplace } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'
import { buildQuery, ListParam } from '@things-factory/shell'
import { EntityManager, getManager, Raw, SelectQueryBuilder } from 'typeorm'
import { Inventory } from '../../../entities'
import lodash from 'lodash'

export const inventoryProductGroupResolver = {
  async inventoryProductGroup(_: any, params: ListParam, context: any) {
    return getManager().transaction(async (trxMgr: EntityManager) => {
      const qb: SelectQueryBuilder<Inventory> = trxMgr.createQueryBuilder(Inventory, 'INV')
      const bizplace: Bizplace = await getMyBizplace(context.state.user)
      const bizplaceId: string = bizplace.id

      let batchProductCondition: { name: string; operator: string; value: [] } = params.filters.find(
        (f: any) => f.name === 'batch_product'
      )
      if (batchProductCondition) {
        params.filters = params.filters.filter((f: any) => f.name !== 'batch_product')
      }

      params.filters = await Promise.all(
        params.filters.map(async (f: any) => {
          if (f.name === 'productName') {
            const products: Product[] = await trxMgr
              .getRepository(Product)
              .find({ where: { bizplace, name: Raw(alias => `LOWER(${alias}) LIKE '${f.value.toLowerCase()}'`) } })
            let productIds: string[] = products.map((p: Product) => p.id)
            if (!productIds?.length) productIds = [null]
            return {
              name: 'product_id',
              operator: 'in',
              value: productIds
            }
          } else {
            return f
          }
        })
      )

      buildQuery(qb, params, context)
      qb.select('"INV"."batch_id"', 'batchId')
        .addSelect('"INV"."packing_type"', 'packingType')
        .addSelect('"PROD"."name"', 'productName')
        .addSelect('SUM(COALESCE("INV"."qty", 0) - COALESCE("INV"."locked_qty", 0))', 'remainQty')
        .addSelect('SUM(COALESCE("INV"."weight", 0) - COALESCE("INV"."locked_weight", 0))', 'remainWeight')
        .leftJoin('INV.product', 'PROD')
        .andWhere('"INV"."bizplace_id" = :bizplaceId', { bizplaceId })
        .groupBy('"INV"."batch_id"')
        .addGroupBy('"INV"."packing_type"')
        .addGroupBy('"PROD"."id"')

      if (batchProductCondition) {
        qb.andWhere(
          `("INV"."batch_id", "PROD"."name") ${
            batchProductCondition.operator === 'in' ? 'IN' : 'NOT IN'
          } (${batchProductCondition.value
            .map((value: { batchId: string; productName: string }) => `('${value.batchId}', '${value.productName}')`)
            .join()})`
        )
      }

      const items: any[] = await qb.getRawMany()

      const [result] = await trxMgr.query(`
          SELECT 
            count(GROUPED_INV.batch_id) as total
          FROM (
            SELECT 
              batch_id
            FROM
              inventories INV
            WHERE
              1 = 1
            AND
              INV.bizplace_id = '${bizplaceId}'
              ${params.filters
                .map((f: { name: string; value: any }) => {
                  switch (f.name) {
                    case 'product_id':
                      if (f.value?.length && f.value[0]) {
                        return `AND INV.product_id IN (${f.value.map((v: string) => `'${v}'`).join()})`
                      } else {
                        return `AND INV.product_id ISNULL`
                      }

                    case 'eq':
                      return `AND INV.${lodash.snakeCase()} = '${f.value}'`

                    default:
                      return `AND LOWER(INV.${lodash.snakeCase(f.name)}) LIKE '${f.value}'`
                  }
                })
                .join(' ')}
              
            GROUP BY
              INV.batch_id,
              INV.product_id
          ) as GROUPED_INV
        `)
      const total: number = result.total

      return { items, total }
    })
  }
}

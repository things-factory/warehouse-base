import { Bizplace, getMyBizplace } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'
import { buildQuery, ListParam } from '@things-factory/shell'
import { EntityManager, getManager, Raw, SelectQueryBuilder } from 'typeorm'
import { Inventory } from '../../../entities'

export const inventoryProductGroupResolver = {
  async inventoryProductGroup(_: any, params: ListParam, context: any) {
    return getManager().transaction(async (trxMgr: EntityManager) => {
      const qb: SelectQueryBuilder<Inventory> = trxMgr.createQueryBuilder(Inventory, 'INV')
      const bizplace: Bizplace = await getMyBizplace(context.state.user)
      const bizplaceId: string = bizplace.id

      params.filters = await Promise.all(
        params.filters.map(async (f: any) => {
          if (f.name === 'productName') {
            const products: Product[] = await trxMgr
              .getRepository(Product)
              .find({ where: { bizplace, name: Raw(alias => `LOWER(${alias}) LIKE '${f.value}'`) } })
            const productIds: string[] = products.map((p: Product) => p.id)
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
      const items: any[] = await qb
        .select('"INV"."batch_id"', 'batchId')
        .addSelect('"INV"."packing_type"', 'packingType')
        .addSelect('"PROD"."name"', 'productName')
        .addSelect('SUM(COALESCE("INV"."qty", 0) - COALESCE("INV"."locked_qty", 0))', 'remainQty')
        .addSelect('SUM(COALESCE("INV"."weight", 0) - COALESCE("INV"."locked_weight", 0))', 'remainWeight')
        .leftJoin('INV.product', 'PROD')
        .andWhere('"INV"."bizplace_id" = :bizplaceId', { bizplaceId })
        .groupBy('"INV"."batch_id"')
        .addGroupBy('"INV"."packing_type"')
        .addGroupBy('"PROD"."id"')
        .getRawMany()

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
                      return `AND INV.product_id IN (${f.value.map((v: string) => `'${v}'`).join()})`

                    case 'eq':
                      return `AND INV.${_.snakeCase(f.name)} = '${f.value}'`

                    default:
                      return `AND LOWER(INV.${_.snakeCase(f.name)}) LIKE '${f.value}'`
                  }
                })
                .join()}
              
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

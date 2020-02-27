import { Bizplace, getMyBizplace } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'
import { ListParam } from '@things-factory/shell'
import { EntityManager, getManager, Raw } from 'typeorm'
import { Inventory } from '../../../entities'

export const inventoryProductGroupResolver = {
  async inventoryProductGroup(_: any, params: ListParam, context: any) {
    return getManager().transaction(async (trxMgr: EntityManager) => {
      const myBizplace: Bizplace = await getMyBizplace(context.state.user)
      const WHERE_CLAUSE = await getWhereClause(myBizplace, params.filters, trxMgr)
      const SELECT_QUERY = getSelectQuery(WHERE_CLAUSE)
      const COUNT_QUERY = getCountQuery(WHERE_CLAUSE)

      const items: Inventory[] = await trxMgr.query(SELECT_QUERY)
      const [{ total }] = await trxMgr.query(COUNT_QUERY)

      return { items, total }
    })
  }
}

function getSelectQuery(whereClause: string): string {
  return `
    WITH oi as (
      SELECT
        SUM(release_qty) as release_qty,
        SUM(release_weight) as release_weight,
        batch_id,
        product_name
      FROM
        order_inventories
      WHERE
        status != 'TERMINATED'
        AND batch_id NOTNULL
        AND product_name NOTNULL
        AND packing_type NOTNULL
      GROUP BY
        batch_id,
        product_name,
        packing_type
    )
    SELECT
      i.batch_id as "batchId",
      i.packing_type as "packingType",
      p.name as "productName",
      SUM(COALESCE(i.qty, 0)) - SUM(COALESCE(i.locked_qty, 0)) - MAX(COALESCE(oi.release_qty, 0)) as "remainQty",
      SUM(COALESCE(i.weight, 0)) - SUM(COALESCE(i.locked_weight, 0)) - MAX(COALESCE(oi.release_weight, 0)) as "remainWeight"
    FROM
      inventories i
      LEFT JOIN products p on i.product_id = p.id
      LEFT JOIN oi on i.batch_id = oi.batch_id AND p.name = oi.product_name AND i.packing_type = oi.packing_type
    ${whereClause}
    GROUP BY
      i.batch_id,
      p.id,
      i.packing_type
  `
}

function getCountQuery(whereClause: string): string {
  return `
    SELECT
      count(grouped_inv.batch_id) as "total"
    FROM (
      SELECT
        i.batch_id
      FROM
        inventories i
      LEFT JOIN products p on i.product_id = p.id
      ${whereClause}
      GROUP BY
        i.batch_id,
        i.product_id,
        i.packing_type
    ) as grouped_inv
  `
}

async function getWhereClause(
  bizplace: Bizplace,
  filters: [{ name: string; operator: string; value: any }],
  trxMgr: EntityManager
): Promise<string> {
  let whereClause = `
    WHERE
      i.status = 'STORED'
    AND i.bizplace_id = '${bizplace.id}'
  `
  await Promise.all(
    filters.map(async (filter: { name: string; operator: string; value: any }) => {
      const name = filter.name
      const operator = filter.operator.toLowerCase()
      const value = filter.value

      switch (name) {
        case 'batchId':
          whereClause += `
        AND LOWER(i.batch_id) LIKE '${value.toLowerCase()}'
      `
          break

        case 'productName':
          const products: Product[] = await trxMgr.getRepository(Product).find({
            select: ['id'],
            where: {
              bizplace,
              name: Raw((alias: string) => `LOWER(${alias}) LIKE '${value.toLowerCase()}'`)
            }
          })
          const productIds: string = products
            .map((product: Product) => product.id)
            .map((id: string) => `'${id}'`)
            .join()

          if (productIds.length) {
            whereClause += `
            AND i.product_id IN (${productIds})
          `
          } else {
            whereClause += `
            AND i.product_id ISNULL
          `
          }
          break
        case 'packingType':
          whereClause += `
          AND LOWER(i.packing_type) LIKE '${value.toLowerCase()}'
        `
          break

        case 'batch_product':
          whereClause += `
          AND (i.batch_id, p.name) ${operator === 'in' ? 'IN' : 'NOT IN'} (${value
            .map((v: { batchId: string; productName: string }) => `('${v.batchId}', '${v.productName}')`)
            .join()})
        `
          break
      }
    })
  )

  return whereClause
}

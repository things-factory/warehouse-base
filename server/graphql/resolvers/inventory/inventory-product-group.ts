import { Bizplace, getPermittedBizplaces } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'
import { ListParam } from '@things-factory/shell'
import { EntityManager, getManager, Raw, In } from 'typeorm'
import { Inventory } from '../../../entities'

export const inventoryProductGroupResolver = {
  async inventoryProductGroup(_: any, params: ListParam, context: any) {
    return getManager().transaction(async (trxMgr: EntityManager) => {
      const bizplaces: Bizplace[] = await getPermittedBizplaces(context.state.domain, context.state.user)
      const WHERE_CLAUSE = await getWhereClause(bizplaces, params.filters, trxMgr)
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
    SELECT * FROM (
      WITH oi as (
        SELECT
          SUM(oi.release_qty) as release_qty,
          SUM(oi.release_weight) as release_weight,
          oi.batch_id,
          p.name as product_name,
          oi.packing_type
        FROM
          order_inventories oi
        LEFT JOIN
          products p
        ON
          oi.product_id = p.id
        WHERE
          oi.status IN ('PENDING', 'PENDING_RECEIVE', 'READY_TO_PICK', 'PICKING', 'PENDING_SPLIT') 
          AND oi.batch_id NOTNULL
          AND oi.product_id NOTNULL
          AND oi.packing_type NOTNULL
          AND oi.inventory_id IS NULL
        GROUP BY
          oi.batch_id,
          oi.product_id,
          oi.packing_type,
          p.name
      )
      SELECT
        i.batch_id as "batchId",
        i.packing_type as "packingType",
        concat(p.name, ' (', p.description, ')') as "productName",
        p.id as "productId",
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
    ) AS inv_prod_grp
    WHERE
      "inv_prod_grp"."remainQty" > 0
  `
}

function getCountQuery(whereClause: string): string {
  return `
    SELECT count(*) as total FROM (
      WITH oi as (
        SELECT
          SUM(oi.release_qty) as release_qty,
          SUM(oi.release_weight) as release_weight,
          oi.batch_id,
          p.name as product_name,
          oi.packing_type
        FROM
          order_inventories oi
        LEFT JOIN
          products p
        ON
          oi.product_id = p.id
        WHERE
          oi.status IN ('PENDING', 'PENDING_RECEIVE', 'READY_TO_PICK', 'PICKING', 'PENDING_SPLIT') 
          AND oi.batch_id NOTNULL
          AND oi.product_id NOTNULL
          AND oi.packing_type NOTNULL
          AND oi.inventory_id IS NULL
        GROUP BY
          oi.batch_id,
          oi.product_id,
          oi.packing_type,
          p.name
      )
      SELECT
        i.batch_id as "batchId",
        i.packing_type as "packingType",
        concat(p.name, ' (', p.description, ')') as "productName",
        p.id as "productId",
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
    ) AS inv_prod_grp
    WHERE
      "inv_prod_grp"."remainQty" > 0
  `
}

async function getWhereClause(
  bizplaces: Bizplace[],
  filters: [{ name: string; operator: string; value: any }],
  trxMgr: EntityManager
): Promise<string> {
  let whereClause = `
    WHERE
      i.status = 'STORED'
    AND i.bizplace_id IN (${bizplaces.map((bizplace: Bizplace) => `'${bizplace.id}'`).join()})
  `
  await Promise.all(
    filters.map(async (filter: { name: string; operator: string; value: any }) => {
      const name = filter.name
      const operator = filter.operator.toLowerCase()
      // const value = filter.value
      let value = filter.value

      switch (name) {
        case 'batchId':
          whereClause += `
        AND LOWER(i.batch_id) LIKE '${value.toLowerCase()}'
      `
          break

        case 'productName':
          const products: Product[] = await trxMgr.getRepository(Product).find({
            select: ['id'],
            where: [
              {
                bizplace: In(bizplaces.map((bizplace: Bizplace) => bizplace.id)),
                name: Raw((alias: string) => `LOWER(${alias}) LIKE '${value.toLowerCase().trim().replace(/'/g, "''")}'`)
              },
              {
                bizplace: In(bizplaces.map((bizplace: Bizplace) => bizplace.id)),
                sku: Raw((alias: string) => `LOWER(${alias}) LIKE '${value.toLowerCase().trim().replace(/'/g, "''")}'`)
              },
              {
                bizplace: In(bizplaces.map((bizplace: Bizplace) => bizplace.id)),
                description: Raw(
                  (alias: string) => `LOWER(${alias}) LIKE '${value.toLowerCase().trim().replace(/'/g, "''")}'`
                )
              }
            ]
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
          AND (i.batch_id, p.id, i.packing_type) ${operator === 'in' ? 'IN' : 'NOT IN'} (${value
            .map(
              (v: { batchId: string; productId: string; packingType: string }) =>
                `('${v.batchId}', '${v.productId}', '${v.packingType}')`
            )
            .join()})
        `
          break
      }
    })
  )

  return whereClause
}

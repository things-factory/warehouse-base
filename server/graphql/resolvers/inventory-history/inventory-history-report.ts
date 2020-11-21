import { convertListParams, ListParam } from '@things-factory/shell'
import { getManager, EntityManager, getRepository } from 'typeorm'
import { User } from '@things-factory/auth-base'
import { Bizplace, BizplaceUser } from '@things-factory/biz-base'
import { InventoryHistory } from '../../../entities'
export const inventoryHistoryReport = {
  async inventoryHistoryReport(_: any, params: ListParam, context: any) {
    try {
      let bizplaceFilter = { name: '', operator: '', value: '' }
      let userFilter = params.filters.find(data => data.name === 'user')
      let fromDate = params.filters.find(data => data.name === 'fromDate')
      let toDate = params.filters.find(data => data.name === 'toDate')
      let batchNo = params.filters.find(data => data.name === 'batchNo')
      let product = params.filters.find(data => data.name === 'product')
      let productDesc = params.filters.find(data => data.name === 'productDescription')
      let hasTransactionOrBalanceFilter = params.filters.find(data => data.name === 'hasTransactionOrBalance')

      if (userFilter) {
        const user: User = await getRepository(User).findOne({
          domain: context.state.domain,
          id: userFilter.value
        })

        const bizplaceUser: any = await getRepository(BizplaceUser).findOne({
          where: {
            user,
            domain: context.state.domain,
            mainBizplace: true
          },
          relations: ['bizplace']
        })

        if (!bizplaceUser.bizplace) throw 'Invalid input'

        bizplaceFilter = { name: 'bizplace', operator: 'eq', value: bizplaceUser.bizplace.id }
      } else {
        bizplaceFilter = params.filters.find(data => data.name === 'bizplace')
      }

      if (!bizplaceFilter || !fromDate || !toDate) throw 'Invalid input'

      const bizplace: Bizplace = await getRepository(Bizplace).findOne({
        id: bizplaceFilter.value
      })

      let batchNoQuery = ''
      if (batchNo) {
        batchNoQuery =
          'AND Lower(invh.batch_id) LIKE ANY(ARRAY[' +
          batchNo.value
            .toLowerCase()
            .split(',')
            .map(prod => {
              return "'%" + prod.trim().replace(/'/g, "''") + "%'"
            })
            .join(',') +
          '])'
      }

      let productQuery = ''
      if (product) {
        let productValue =
          product.value
            .toLowerCase()
            .split(',')
            .map(prod => {
              return "'%" + prod.trim().replace(/'/g, "''") + "%'"
            })
            .join(',') + ']) '
        productQuery =
          'AND Lower(name) LIKE ANY(ARRAY[' +
          productValue +
          'OR Lower(sku) LIKE ANY(ARRAY[' +
          productValue +
          'OR Lower(description) LIKE ANY(ARRAY[' +
          productValue
      }

      let productDescQuery = ''
      if (productDesc) {
        productDescQuery = "AND Lower(description) LIKE '%" + productDesc.value.toLowerCase() + "%'"
      }

      let hasTransactionOrBalanceQuery = ''
      if (hasTransactionOrBalanceFilter && hasTransactionOrBalanceFilter.value) {
        hasTransactionOrBalanceQuery = 'and (src.totalRow > 1 or src.totalQty <> 0)'
      }

      return await getManager().transaction(async (trxMgr: EntityManager) => {
        await trxMgr.query(
          `
        create temp table temp_products AS 
        (
          select * from products prd where 
          prd.bizplace_id = $1
          ${productQuery}
        )`,
          [bizplace.id]
        )

        await trxMgr.query(
          `
        create temp table temp_data_src AS
        (
          SELECT prd.name AS product_name, prd.description AS product_description, trim(invh.batch_id) as batch_id, invh.product_id,
          invh.packing_type, invh.bizplace_id, invh.domain_id,
          invh.ref_order_id, invh.order_no, invh.order_ref_no, invh.transaction_type, invh.created_at,
          invh.qty, invh.opening_qty, 
          invh.uom, COALESCE(invh.uom_value, 0) as uom_value, COALESCE(invh.opening_uom_value, 0) as opening_uom_value
          FROM reduced_inventory_histories invh
          INNER JOIN temp_products prd ON prd.id = invh.product_id::uuid
          WHERE
          invh.domain_id = $1
          AND invh.bizplace_id = $2
          AND invh.created_at::date <= $3
          ${batchNoQuery}
        ) 
      `,
          [context.state.domain.id, bizplace.id, new Date(toDate.value).toISOString()]
        )

        await trxMgr.query(
          `
          create temp table temp_inv_history as (
            SELECT src.product_name, src.product_description, src.batch_id, src.product_id, src.packing_type, src.uom,
            src.bizplace_id, src.domain_id,
            SUM(COALESCE(src.qty,0)) AS qty,
            SUM(COALESCE(src.opening_qty,0)) AS opening_qty,
            SUM(COALESCE(src.uom_value,0)) AS uom_value,
            SUM(COALESCE(src.opening_uom_value,0)) AS opening_uom_value,
            'Opening Balance' AS order_name,
            '-' AS ref_no,
            0 AS rn,
            $1::timestamp AS created_at,
            $1::date AS created_date  
            FROM temp_data_src src
            WHERE src.created_at::date < $1::date
            GROUP BY src.product_name, src.product_description, src.batch_id, src.product_id, src.packing_type, src.uom,
            src.bizplace_id, src.domain_id
            UNION ALL
            SELECT product_name, product_description, batch_id, product_id, packing_type, uom, bizplace_id, 
            domain_id, sum(qty) as qty, sum(opening_qty) as opening_qty, sum(uom_value) as uom_value, sum(opening_uom_value) as opening_uom_value, 
            order_name, ref_no, 1 AS rn, MIN(created_at) as created_at, MIN(created_at)::DATE as created_date
            FROM (
              SELECT invh.product_name, invh.product_description, invh.batch_id, invh.product_id, invh.packing_type, invh.bizplace_id, 
              invh.domain_id,
              invh.qty, invh.opening_qty,	invh.uom_value, invh.uom, invh.opening_uom_value,
              COALESCE(order_no, '-') AS order_name,
              COALESCE(order_ref_no, '-') AS ref_no,
              invh.created_at,
              invh.created_at::date as created_date
              FROM temp_data_src invh
              WHERE (invh.qty <> 0 OR invh.uom_value <> 0) AND 
              invh.transaction_type <> 'ADJUSTMENT' AND 
              invh.transaction_type <>'NEW'
              AND invh.created_at::date >= $1::date
            ) AS inv_movement 
            GROUP BY product_name, product_description, batch_id, product_id, packing_type, uom, bizplace_id, 
            domain_id, order_name, ref_no, rn
            UNION ALL
            SELECT product_name, product_description, batch_id, product_id, packing_type, uom, bizplace_id, 
            domain_id, sum(qty) as qty, sum(opening_qty) as opening_qty, sum(uom_value) as uom_value, sum(opening_uom_value) as opening_uom_value,
            order_name, ref_no, 1 AS rn, created_at, created_at::date as created_date
            FROM (
              SELECT invh.product_name, invh.product_description, invh.batch_id, invh.product_id, invh.packing_type, invh.uom, invh.bizplace_id, 
              invh.domain_id,
              invh.qty, invh.opening_qty,	invh.uom_value, invh.opening_uom_value,
              invh.transaction_type AS order_name,
              invh.transaction_type AS ref_no,
              invh.created_at,
              invh.created_at:: date as created_date
              FROM temp_data_src invh
              WHERE (invh.qty <> 0 OR invh.uom_value <> 0) AND 
              (invh.transaction_type = 'ADJUSTMENT' OR 
              invh.transaction_type = 'NEW')
              AND invh.created_at::date >= $1::date
            ) AS inv_movement 
            GROUP BY product_name, product_description, batch_id, product_id, packing_type, uom, bizplace_id, 
            domain_id, order_name, ref_no, rn, created_at
          )`,
          [new Date(fromDate.value).toISOString()]
        )

        const result: any = await trxMgr.query(
          ` 
          select product_name, product_description, batch_id, product_id, packing_type, uom, bizplace_id, 
          domain_id, qty, opening_qty, uom_value, opening_uom_value, order_name, ref_no, created_at::date
          from temp_inv_history invh where
          exists (
            select * from (
              select batch_id, product_name, packing_type, sum(qty) as totalQty, count(*) as totalRow from temp_inv_history ih2 
              group by batch_id, product_name, packing_type
            ) src 
            where src.batch_id = invh.batch_id and src.product_name = invh.product_name and src.packing_type = invh.packing_type
            ${hasTransactionOrBalanceQuery}
          )
          ORDER BY invh.product_name asc, invh.product_description asc, invh.packing_type asc, invh.batch_id asc, invh.rn asc, invh.created_at asc
        `
        )

        trxMgr.query(
          `
          drop table temp_products, temp_data_src, temp_inv_history
        `
        )

        let items = result as any
        items = items.map(item => {
          return {
            batchId: item.batch_id,
            bizplace: bizplace,
            packingType: item.packing_type,
            product: {
              id: item.product_id,
              name: item.product_name + ' ( ' + item.product_description + ' )'
            },
            qty: item.qty,
            uom: item.uom,
            uomValue: item.uom_value,
            openingQty: item.opening_qty,
            openingUomValue: item.opening_uom_value,
            orderName: item.order_name,
            orderRefNo: item.ref_no,
            createdAt: item.created_at
          }
        })

        return items
      })
    } catch (error) {
      throw error
    }
  }
}

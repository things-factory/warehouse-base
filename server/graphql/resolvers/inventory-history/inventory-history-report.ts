import { convertListParams, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { User } from '@things-factory/auth-base'
import { Bizplace, BizplaceUser } from '@things-factory/biz-base'
import { InventoryHistory } from '../../../entities'
import { Product } from '@things-factory/product-base'
export const inventoryHistoryReport = {
  async inventoryHistoryReport(_: any, params: ListParam, context: any) {
    try {
      const convertedParams = convertListParams(params)
      let userFilter = params.filters.find(data => data.name === 'user')

      let bizplaceFilter = { name: '', operator: '', value: '' }

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

      let fromDate = params.filters.find(data => data.name === 'fromDate')
      let toDate = params.filters.find(data => data.name === 'toDate')
      let product = params.filters.find(data => data.name === 'product')

      if (!bizplaceFilter || !fromDate || !toDate) throw 'Invalid input'

      const bizplace: Bizplace = await getRepository(Bizplace).findOne({
        domain: context.state.domain,
        id: bizplaceFilter.value
      })

      let productQuery = ''
      if (product) {
        productQuery =
          'AND prd.name ILIKE ANY(ARRAY[' +
          product.value
            .split(',')
            .map(prod => {
              return "'%" + prod.trim() + "%'"
            })
            .join(',') +
          '])'
        // productQuery = "AND invh.product_id ANY ARRAY['','%abc%','%xyz%']"
      }

      const result = await getRepository(InventoryHistory).query(`
        ;WITH invhCte AS
        (
          SELECT prd.name AS product_name, prd.description AS product_description, invh.batch_id, invh.product_id, invh.packing_type, invh.bizplace_id, invh.domain_id,
          SUM(COALESCE(oldinvh.opening_qty,0) + COALESCE(oldinvh.qty,0)) AS qty,
          0 AS opening_qty,
          SUM(COALESCE(oldinvh.opening_weight,0) + COALESCE(oldinvh.weight,0)) AS weight,
          0 AS opening_weight,
          'Opening Balance' AS order_name,
          '-' AS ref_no,
          0 AS rn,
          to_timestamp('${new Date(
            fromDate.value
          ).toLocaleDateString()} 00:00:00', 'MM/DD/YYYY HH24:MI:SS') AS created_at
          FROM inventory_histories invh
          LEFT JOIN inventory_histories oldinvh ON oldinvh.product_id = invh.product_id AND oldinvh.batch_id = invh.batch_id AND oldinvh.packing_type = invh.packing_type
          AND oldinvh.created_at < '${new Date(fromDate.value).toLocaleDateString()} 00:00:00'
          INNER JOIN products prd on cast(prd.id AS VARCHAR) = invh.product_id
          WHERE    
          invh.transaction_type in ('ADJUSTMENT', 'UNLOADING', 'PICKING', 'UNDO_UNLOADING')
          AND invh.domain_id = '${context.state.domain.id}'
          AND invh.bizplace_id = '${bizplace.id}'
          AND invh.created_at BETWEEN '${new Date(fromDate.value).toLocaleDateString()} 00:00:00'
          AND '${new Date(toDate.value).toLocaleDateString()} 23:59:59'
          ${productQuery}
          GROUP BY prd.name, prd.description, invh.batch_id, invh.product_id, invh.packing_type, invh.bizplace_id, invh.domain_id
        )
        SELECT * FROM (
          SELECT *
          FROM invhCte
          UNION ALL
          SELECT prd.name AS product_name, prd.description AS product_description, invh.batch_id, invh.product_id, invh.packing_type, invh.bizplace_id, invh.domain_id,
          invh.qty, invh.opening_qty,
          invh.weight, invh.opening_weight,
          CASE WHEN invh.transaction_type = 'ADJUSTMENT' THEN 'ADJUSTMENT'
               ELSE COALESCE(order_no, '-') END AS order_name,
          CASE WHEN invh.transaction_type = 'ADJUSTMENT' THEN 'ADJUSTMENT' 
          	   ELSE COALESCE(order_ref_no, '-') END AS ref_no,
          1 AS rn, invh.created_at
          FROM inventory_histories invh
          LEFT JOIN arrival_notices arrNo ON cast(arrNo.id AS VARCHAR) = invh.ref_order_id AND (invh.transaction_type = 'UNLOADING' OR invh.transaction_type = 'UNDO_UNLOADING')
          LEFT JOIN worksheets wks ON cast(wks.id AS VARCHAR) = invh.ref_order_id AND invh.transaction_type = 'PICKING'
          LEFT JOIN release_goods rel ON cast(rel.id AS VARCHAR) = cast(wks.release_good_id AS VARCHAR) AND invh.transaction_type = 'PICKING'
          INNER JOIN products prd on cast(prd.id AS VARCHAR) = invh.product_id
          WHERE
          invh.transaction_type IN ('ADJUSTMENT', 'UNLOADING', 'PICKING', 'UNDO_UNLOADING')
          AND invh.domain_id = '${context.state.domain.id}'
          AND invh.bizplace_id = '${bizplace.id}'
          AND invh.created_at BETWEEN '${new Date(fromDate.value).toLocaleDateString()} 00:00:00'
          AND '${new Date(toDate.value).toLocaleDateString()} 23:59:59'
          ${productQuery}
        ) AS src order by product_id asc, batch_id asc, rn asc, created_at asc
      `)

      let items = result as any

      items = await Promise.all(
        items.map(async item => {
          let product: Product = await getRepository(Product).findOne({
            domain: context.state.domain,
            bizplace: item.bizplace_id ? item.bizplace_id : '',
            id: item.product_id
          })

          if (product) product.name = product.name + ' ( ' + product.description + ' )'

          return {
            batchId: item.batch_id,
            bizplace: bizplace,
            packingType: item.packing_type,
            product: product ? product : { name: '' },
            qty: item.qty,
            weight: item.weight,
            orderName: item.order_name,
            orderRefNo: item.ref_no,
            createdAt: item.created_at
          } as any
        })
      )

      return items
    } catch (error) {
      throw error
    }
  }
}

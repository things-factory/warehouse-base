import { convertListParams, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Bizplace } from '@things-factory/biz-base'
import { InventoryHistory } from '../../../entities'
import { Product } from '@things-factory/product-base'
export const inventoryHistoryReport = {
  async inventoryHistoryReport(_: any, params: ListParam, context: any) {
    try {
      const convertedParams = convertListParams(params)
      let bizplaceFilter = params.filters.find(data => data.name === 'bizplace')
      let fromDate = params.filters.find(data => data.name === 'fromDate')
      let toDate = params.filters.find(data => data.name === 'toDate')

      if (!bizplaceFilter || !fromDate || !toDate) throw 'Invalid input'

      const bizplace: Bizplace = await getRepository(Bizplace).findOne({
        domain: context.state.domain,
        id: bizplaceFilter.value
      })

      const result = await getRepository(InventoryHistory).query(`
        ;WITH invhCte AS
        (
          select invh.batch_id, invh.product_id, invh.packing_type, invh.bizplace_id, invh.domain_id,
          sum(COALESCE(oldinvh.opening_qty,0) + COALESCE(oldinvh.qty,0)) as qty,
          0 as opening_qty,
          sum(COALESCE(oldinvh.opening_weight,0) + COALESCE(oldinvh.weight,0)) as weight,
          0 as opening_weight,
          'Opening Balance' AS order_name,
          '-' AS ref_no,
          0 as rn,
          to_timestamp('${new Date(
            fromDate.value
          ).toLocaleDateString()} 00:00:00', 'MM/DD/YYYY HH24:MI:SS') as created_at
          from inventory_histories invh
          left join inventory_histories oldinvh on oldinvh.product_id = invh.product_id and oldinvh.batch_id = invh.batch_id and oldinvh.packing_type = invh.packing_type
          and oldinvh.created_at < '${new Date(fromDate.value).toLocaleDateString()} 00:00:00'
          left join arrival_notices arrNo on cast(arrNo.id as VARCHAR) = invh.ref_order_id and (invh.transaction_type = 'UNLOADING' OR invh.transaction_type = 'UNDO_UNLOADING')
          left join release_goods rel on cast(rel.id as VARCHAR) = invh.ref_order_id and invh.transaction_type = 'PICKING'
          where    
          invh.transaction_type in ('ADJUSTMENT', 'UNLOADING', 'PICKING', 'UNDO_UNLOADING')
          and invh.domain_id = '${context.state.domain.id}'
          and invh.bizplace_id = '${bizplace.id}'
          and invh.created_at BETWEEN '${new Date(fromDate.value).toLocaleDateString()} 00:00:00'
          and '${new Date(toDate.value).toLocaleDateString()} 23:59:59'
          group by invh.batch_id, invh.product_id, invh.packing_type, invh.bizplace_id, invh.domain_id
        )
        select * from (
          SELECT *
          FROM invhCte
          union all
          select invh.batch_id, invh.product_id, invh.packing_type, invh.bizplace_id, invh.domain_id,
          invh.qty, invh.opening_qty,
          invh.weight, invh.opening_weight,
          CASE WHEN invh.transaction_type = 'UNLOADING' THEN arrNo."name" 
               WHEN invh.transaction_type = 'UNDO_UNLOADING' then concat(arrNo."name", ' (Undo-Unloading)')
               WHEN invh.transaction_type = 'PICKING' THEN rel."name" ELSE 'ADJUSTMENT' END AS order_name,
          CASE WHEN invh.transaction_type = 'UNLOADING' THEN arrNo.ref_no 
               WHEN invh.transaction_type = 'PICKING' THEN rel.ref_no ELSE 'ADJUSTMENT' END AS ref_no,
          1 as rn, invh.created_at
          FROM inventory_histories invh
          LEFT JOIN arrival_notices arrNo ON cast(arrNo.id as VARCHAR) = invh.ref_order_id AND (invh.transaction_type = 'UNLOADING' OR invh.transaction_type = 'UNDO_UNLOADING')
          LEFT JOIN worksheets wks ON cast(wks.id as VARCHAR) = invh.ref_order_id AND invh.transaction_type = 'PICKING'
          LEFT JOIN release_goods rel ON cast(rel.id as VARCHAR) = cast(wks.release_good_id as VARCHAR) AND invh.transaction_type = 'PICKING'
          WHERE
          invh.transaction_type IN ('ADJUSTMENT', 'UNLOADING', 'PICKING', 'UNDO_UNLOADING')
          AND invh.domain_id = '${context.state.domain.id}'
          AND invh.bizplace_id = '${bizplace.id}'
          AND invh.created_at BETWEEN '${new Date(fromDate.value).toLocaleDateString()} 00:00:00'
          AND '${new Date(toDate.value).toLocaleDateString()} 23:59:59'          
        ) as src order by product_id asc, batch_id asc, rn asc, created_at asc
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

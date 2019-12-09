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
          SELECT invh.*,
          CASE WHEN invh.transaction_type = 'UNLOADING' THEN arrNo."name" WHEN invh.transaction_type = 'PICKING' THEN rel."name" ELSE NULL END AS order_name,
          CASE WHEN invh.transaction_type = 'UNLOADING' THEN arrNo.ref_no WHEN invh.transaction_type = 'PICKING' THEN rel.ref_no ELSE NULL END AS ref_no
          FROM inventory_histories invh
          LEFT JOIN arrival_notices arrNo ON cast(arrNo.id as VARCHAR) = invh.ref_order_id AND invh.transaction_type = 'UNLOADING'
          LEFT JOIN release_goods rel ON cast(rel.id as VARCHAR) = invh.ref_order_id AND invh.transaction_type = 'PICKING'
          WHERE invh.transaction_type IN ('UNLOADING', 'PICKING')       
          AND invh.domain_id = '${context.state.domain.id}' AND ref_order_id IS NOT NULL
          AND invh.bizplace_id = '${bizplace.id}'
          AND invh.created_at BETWEEN '${new Date(fromDate.value).toLocaleDateString()} 00:00:00' 
          AND '${new Date(toDate.value).toLocaleDateString()} 23:59:59'
          ORDER BY invh.created_at
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
            seq: item.seq,
            palletId: item.pallet_id,
            batchId: item.batch_id,
            bizplace: bizplace,
            packingType: item.packing_type,
            product: product ? product : { name: '' },
            qty: item.qty,
            status: item.status,
            orderName: item.order_name,
            orderRefNo: item.ref_no,
            transactionType: item.transaction_type,
            zone: item.zone,
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

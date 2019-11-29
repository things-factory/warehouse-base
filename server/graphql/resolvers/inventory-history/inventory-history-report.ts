import { convertListParams, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Bizplace } from '@things-factory/biz-base'
import { InventoryHistory } from '../../../entities'
import { Product } from '@things-factory/product-base'

export const inventoryHistoryReport = {
  async inventoryHistoryReport(_: any, params: ListParam, context: any) {
    const convertedParams = convertListParams(params)

    const result = await getRepository(InventoryHistory).query(`
        SELECT CASE WHEN status = 'UNLOADED' THEN 'IN'
        WHEN status = 'PICKED' THEN 'OUT' ELSE status END AS transaction_flow,
        *
        FROM inventory_histories WHERE status IN ('UNLOADED', 'PICKED')        
        AND domain_id = '${context.state.domain.id}'
    `)
    // const [items, total] = await getRepository(InventoryHistory).findAndCount({
    //   ...convertedParams,
    //   relations: ['domain', 'creator', 'updater', 'bizplace', 'product']
    // })
    // return { items, total }

    //     select case when status = 'UNLOADED' then 'IN'
    // when status = 'TERMINATED' then 'OUT' else status end as transaction_flow,
    // *
    // from inventory_histories where status in ('UNLOADED', 'PICKING')

    // const result = await getRepository(InventoryHistory).findAndCount({
    //   ...convertedParams,
    //   relations: ['domain', 'bizplace', 'updater']
    // })

    let items = result as any

    items = await Promise.all(
      items.map(async item => {
        let bizplace = await getRepository(Bizplace).findOne({
          domain: context.state.domain,
          id: item.bizplace_id ? item.bizplace_id : ''
        })
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
          product: product,
          qty: item.qty,
          status: item.status,
          transactionType: item.transaction_type,
          zone: item.zone,
          transactionFlow: item.transaction_flow,
          createdAt: item.created_at
        } as any
      })
    )

    return items
  }
}

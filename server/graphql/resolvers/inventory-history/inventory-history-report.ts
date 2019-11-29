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
        WHEN status = 'TERMINATED' THEN 'OUT' ELSE status END AS transaction_flow,
        *
        FROM inventory_histories WHERE status IN ('UNLOADED', 'PICKING')        
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
      items.map(async (item) => {
        let product = await getRepository(Product).findOne({
          domain: context.state.domain,
          bizplace: item.bizplace ? item.bizplace.id : null,
          id: item.productId
        })
        return {
          seq: item.seq,
          palletId: item.palletId,
          batchId: item.batchId,
          bizplace: item.bizplace,
          packingType: item.packingType,
          product: product,
          qty: item.qty,
          status: item.status,
          transactionType: item.transactionType,
          zone: item.zone,
          createdAt: item.createdAt
        } as any
      })
    )

    return items 
  }
}

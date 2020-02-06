import { convertListParams, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { InventoryHistory, Warehouse, Location } from '../../../entities'
import { Bizplace, getPermittedBizplaceIds } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'

export const inventoryHistoriesResolver = {
  async inventoryHistories(_: any, params: ListParam, context: any) {
    if (!params.filters.find((filter: any) => filter.name === 'bizplace')) {
      params.filters.push({
        name: 'bizplace',
        operator: 'in',
        value: await getPermittedBizplaceIds(context.state.domain, context.state.user)
      })
    }

    const convertedParams = convertListParams(params)
    let [items, total] = await getRepository(InventoryHistory).findAndCount({
      ...convertedParams,
      relations: ['domain', 'bizplace', 'creator', 'updater'],
      order: {
        palletId: 'DESC',
        createdAt: 'ASC'
      }
    })

    items = (await Promise.all(
      items.map(async item => {
        switch (item.transactionType) {
          case 'UNLOADING':
            item.description = 'Inbound'
            break
          case 'UNDO_UNLOADING':
            item.description = 'Undo Unloading'
            item.orderRefNo = ''
            break
          case 'LOADING':
            item.description = 'Loading'
            break
          case 'UNDO_LOADING':
            item.description = 'Undo Loading'
            break
          default:
            item.description = String(item.transactionType)
            break
        }
        item.description = item.description.toUpperCase()
        return {
          ...item,
          orderRefNo: item.orderRefNo,
          orderNo: item.orderNo,
          qty: item.openingQty + item.qty,
          product: await getRepository(Product).findOne(item.productId),
          warehouse: await getRepository(Warehouse).findOne(item.warehouseId),
          location: await getRepository(Location).findOne(item.locationId)
        }
      })
    )) as any

    return { items, total }
  }
}

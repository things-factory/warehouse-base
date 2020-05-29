import { ListParam, convertListParams } from '@things-factory/shell'
import { getPermittedBizplaceIds } from '@things-factory/biz-base'
import { getRepository, SelectQueryBuilder } from 'typeorm'
import { Product } from '@things-factory/product-base'
import { InventoryChange, Warehouse, Location } from '../../../entities'

export const inventoryChangesResolver = {
  async inventoryChanges(_: any, params: ListParam, context: any) {
    if (!params.filters.find((filter: any) => filter.name === 'inventory.bizplace')) {
      params.filters.push({
        name: 'inventory.bizplace',
        operator: 'in',
        value: await getPermittedBizplaceIds(context.state.domain, context.state.user)
      })
    }

    const convertedParams = convertListParams(params, context.state.domain.id)
    let [items, total] = await getRepository(InventoryChange).findAndCount({
      ...convertedParams,
      relations: [
        'bizplace',
        'inventory',
        'inventory.bizplace',
        'inventory.product',
        'inventory.location',
        'product',
        'location',
        'domain',
        'lastInventoryHistory',
        'lastInventoryHistory.bizplace',
        'creator',
        'updater'
      ],
      order: {
        createdAt: 'DESC'
      }
    })

    items = await Promise.all(
      items.map(async item => {
        if (item.lastInventoryHistory != null) {
          item.lastInventoryHistory = {
            ...item.lastInventoryHistory,
            product: await getRepository(Product).findOne(item.lastInventoryHistory.productId),
            warehouse: await getRepository(Warehouse).findOne(item.lastInventoryHistory.warehouseId),
            location: await getRepository(Location).findOne(item.lastInventoryHistory.locationId)
          } as any
        }
        return item
      })
    )

    return { items, total }
  }
}

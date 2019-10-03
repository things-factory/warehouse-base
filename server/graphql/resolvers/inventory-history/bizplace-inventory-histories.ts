import { Bizplace } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'
import { convertListParams } from '@things-factory/shell'
import { getRepository, In, Like, Between } from 'typeorm'
import { Inventory, Location, Warehouse, InventoryHistory } from '../../../entities'
import { INVENTORY_STATUS } from '../../../constants'

export const bizplaceInventoryHistories = {
  async bizplaceInventoryHistories(_: any, { inventoryHistory, pagination, sortings }, context: any) {
    const bizplace: Bizplace = inventoryHistory.bizplace
    const fromDate: Date = new Date(inventoryHistory.fromDate)
    const toDate: Date = new Date(inventoryHistory.toDate)

    const convertedParams = convertListParams({ pagination, sortings })
    const commonCondition = {
      domain: context.state.domain,
      bizplace: await getRepository(Bizplace).findOne(bizplace)
    }
    let where = { ...commonCondition }

    if (inventoryHistory && inventoryHistory.productName) {
      const _products: Product[] = await getRepository(Product).find({
        ...commonCondition,
        name: Like(`%${inventoryHistory.productName}%`)
      })
      where['productId'] = In(_products.map((product: Product) => product.id))
    }

    if (inventoryHistory && inventoryHistory.warehouseName) {
      const _warehouses: Warehouse[] = await getRepository(Warehouse).find({
        ...commonCondition,

        name: Like(`%${inventoryHistory.warehouseName}%`)
      })
      where['warehouseId'] = In(_warehouses.map((warehouse: Warehouse) => warehouse.id))
    }

    if (inventoryHistory && inventoryHistory.locationName) {
      const _locations = await getRepository(Location).find({
        ...commonCondition,
        name: Like(`%${inventoryHistory.locationName}%`)
      })
      where['locationId'] = In(_locations.map((location: Location) => location.id))
    }

    where['updatedAt'] = Between(fromDate.toISOString, toDate.toISOString)

    let [items, total] = await getRepository(InventoryHistory).findAndCount({
      ...convertedParams,
      where,
      relations: ['domain', 'bizplace', 'updater']
    })

    const inventoryList: any[] = items.map(async (item: InventoryHistory) => {
      return {
        palletId: item.palletId,
        batchId: item.batchId,
        bizplace: item.bizplace,
        qty: item.qty,
        product: await getRepository(Product).findOne({ ...commonCondition, id: item.productId }),
        warehouse: await getRepository(Warehouse).findOne({ ...commonCondition, id: item.warehouseId }),
        location: await getRepository(Warehouse).findOne({ ...commonCondition, id: item.locationId }),
        updatedAt: item.updatedAt,
        updater: item.updater
      }
    })

    return { inventoryList, total }
  }
}

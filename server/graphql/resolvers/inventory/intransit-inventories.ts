import { Bizplace } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'
import { convertListParams } from '@things-factory/shell'
import { Equal, getRepository, In, IsNull, Like } from 'typeorm'
import { INVENTORY_STATUS, INVENTORY_TYPES } from '../../../constants'
import { Inventory, Location, Warehouse } from '../../../entities'

export const intransitInventories = {
  async intransitInventories(_: any, { inventory, pagination, sortings }, context: any) {
    const convertedParams = convertListParams({ pagination, sortings })
    let targetBizplaces: String[]
    if (inventory && inventory.bizplaceName) {
      const bizplaces: Bizplace[] = await getRepository(Bizplace).find({
        where: { name: Like(`%${inventory.bizplaceName}%`) }
      })
      targetBizplaces = bizplaces.map((bizplace: Bizplace) => bizplace.id)
    } else {
      targetBizplaces = context.state.bizplaces.map((bizplace: Bizplace) => bizplace.id)
    }

    const commonCondition = {
      domain: context.state.domain,
      status: INVENTORY_STATUS.INTRANSIT,
      type: INVENTORY_TYPES.SHELF
    }

    if (targetBizplaces.length) commonCondition['bizplace'] = In(targetBizplaces)

    let where = { ...commonCondition }

    if (inventory && inventory.zone) where['zone'] = Like(`%${inventory.zone}%`)
    if (inventory && inventory.palletId) where['palletId'] = Like(`%${inventory.palletId}%`)
    if (inventory && inventory.batchId) where['batchId'] = Like(`%${inventory.batchId}%`)

    if (inventory && inventory.productName) {
      const products: Product[] = await getRepository(Product).find({
        where: { domain: context.state.domain, name: Like(`%${inventory.productName}%`) }
      })
      if (products.length) {
        where['product'] = In(products.map((product: Product) => product.id))
      } else {
        where['product'] = Equal(IsNull())
      }
    }

    if (inventory && inventory.warehouseName) {
      const warehouses: Warehouse[] = await getRepository(Warehouse).find({
        where: { domain: context.state.domain, name: Like(`%${inventory.warehouseName}%`) }
      })
      if (warehouses.length) {
        where['warehouse'] = In(warehouses.map((warehouse: Warehouse) => warehouse.id))
      } else {
        where['warehouse'] = Equal(IsNull())
      }
    }

    if (inventory && inventory.locationName) {
      const locations: Location[] = await getRepository(Location).find({
        where: { domain: context.state.domain, name: Like(`%${inventory.locationName}%`) }
      })
      if (locations.length) {
        where['location'] = In(locations.map((location: Location) => location.id))
      } else {
        where['location'] = Equal(IsNull())
      }
    }

    const [items, total] = await getRepository(Inventory).findAndCount({
      ...convertedParams,
      where,
      relations: ['domain', 'bizplace', 'product', 'warehouse', 'location', 'creator', 'updater']
    })

    return { items, total }
  }
}

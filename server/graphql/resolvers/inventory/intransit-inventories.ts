import { Bizplace } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'
import { convertListParams } from '@things-factory/shell'
import { getRepository, In, Like } from 'typeorm'
import { Inventory, Location, Warehouse } from '../../../entities'
import { INVENTORY_STATUS, INVENTORY_TYPES } from '../../../constants'

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
      bizplace: In(targetBizplaces),
      status: INVENTORY_STATUS.INTRANSIT,
      type: INVENTORY_TYPES.SHELF
    }

    let where = { ...commonCondition }

    if (inventory && inventory.zone) where['zone'] = Like(`%${inventory.zone}%`)
    if (inventory && inventory.palletId) where['palletId'] = Like(`%${inventory.palletId}%`)
    if (inventory && inventory.batchId) where['batchId'] = Like(`%${inventory.batchId}%`)

    if (inventory && inventory.productName) {
      const products: Product[] = await getRepository(Product).find({
        where: { domain: context.state.domain, name: Like(`%${inventory.productName}%`) }
      })
      where['product'] = In(products.map((product: Product) => product.id))
    }

    if (inventory && inventory.warehouseName) {
      const warehouses: Warehouse[] = await getRepository(Warehouse).find({
        where: { domain: context.state.domain, name: Like(`%${inventory.warehouseName}%`) }
      })
      where['warehouse'] = In(warehouses.map((warehouse: Warehouse) => warehouse.id))
    }

    if (inventory && inventory.locationName) {
      const locations: Location[] = await getRepository(Location).find({
        where: { domain: context.state.domain, name: Like(`%${inventory.locationName}%`) }
      })
      where['location'] = In(locations.map((location: Location) => location.id))
    }

    const [items, total] = await getRepository(Inventory).findAndCount({
      ...convertedParams,
      where,
      relations: ['domain', 'bizplace', 'product', 'warehouse', 'location', 'creator', 'updater']
    })

    return { items, total }
  }
}

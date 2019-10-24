import { Bizplace } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'
import { convertListParams } from '@things-factory/shell'
import { getRepository, In, IsNull, Raw, Not } from 'typeorm'
import { INVENTORY_STATUS, INVENTORY_TYPES } from '../../../constants'
import { Inventory, Location, Warehouse } from '../../../entities'

export const onhandInventories = {
  async onhandInventories(_: any, { inventory, pagination, sortings }, context: any) {
    const convertedParams = convertListParams({ pagination, sortings })
    let targetBizplaces: String[]
    if (inventory && inventory.bizplaceName) {
      const bizplaces: Bizplace[] = await getRepository(Bizplace).find({
        where: { name: Raw(alias => `LOWER(${alias}) LIKE '${inventory.bizplaceName.toLowerCase()}'`) }
      })
      targetBizplaces = bizplaces.map((bizplace: Bizplace) => bizplace.id)
    } else {
      targetBizplaces = context.state.bizplaces.map((bizplace: Bizplace) => bizplace.id)
    }

    const commonCondition = {
      domain: context.state.domain,
      status: Not(In([INVENTORY_STATUS.INTRANSIT, INVENTORY_STATUS.TERMINATED, INVENTORY_STATUS.DELETED])),
      type: INVENTORY_TYPES.SHELF
    }

    if (targetBizplaces.length) commonCondition['bizplace'] = In(targetBizplaces)

    let where = { ...commonCondition }

    if (inventory && inventory.zone) {
      where['zone'] = Raw(alias => `LOWER(${alias}) LIKE '${inventory.zone.toLowerCase()}'`)
    }
    if (inventory && inventory.palletId) {
      where['palletId'] = Raw(alias => `LOWER(${alias}) LIKE '${inventory.palletId.toLowerCase()}'`)
    }
    if (inventory && inventory.batchId) {
      where['batchId'] = Raw(alias => `LOWER(${alias}) LIKE '${inventory.batchId.toLowerCase()}'`)
    }

    if (inventory && inventory.productName) {
      const products: Product[] = await getRepository(Product).find({
        where: {
          domain: context.state.domain,
          name: Raw(alias => `LOWER(${alias}) LIKE '${inventory.productName.toLowerCase()}'`)
        }
      })
      if (products.length) {
        where['product'] = In(products.map((product: Product) => product.id))
      } else {
        where['product'] = IsNull()
      }
    }

    if (inventory && inventory.warehouseName) {
      const warehouses: Warehouse[] = await getRepository(Warehouse).find({
        where: {
          domain: context.state.domain,
          name: Raw(alias => `LOWER(${alias}) LIKE '${inventory.warehouseName.toLowerCase()}'`)
        }
      })
      if (warehouses.length) {
        where['warehouse'] = In(warehouses.map((warehouse: Warehouse) => warehouse.id))
      } else {
        where['warehouse'] = IsNull()
      }
    }

    if (inventory && inventory.locationName) {
      const locations: Location[] = await getRepository(Location).find({
        where: {
          domain: context.state.domain,
          name: Raw((alias: string) => `LOWER(${alias}) LIKE '${inventory.locationName.toLowerCase()}'`)
        }
      })
      if (locations.length) {
        where['location'] = In(locations.map((location: Location) => location.id))
      } else {
        where['location'] = IsNull()
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

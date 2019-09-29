import { Bizplace } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'
import { convertListParams } from '@things-factory/shell'
import { getRepository, In, Like } from 'typeorm'
import { Inventory, Location, Warehouse } from '../../../entities'
import { INVENTORY_STATUS } from '../../../constants'

export const onhandInventories = {
  async onhandInventories(_: any, { inventory, pagination, sortings }, context: any) {
    const convertedParams = convertListParams({ pagination, sortings })
    const commonCondition = {
      domain: context.state.domain,
      bizplace: In(context.state.bizplaces.map((bizplace: Bizplace) => bizplace.id)),
      status: INVENTORY_STATUS.OCCUPIED
    }
    let where = { ...commonCondition }

    if (inventory.product)
      where['product'] = await getRepository(Product).findOne({
        where: { ...commonCondition, name: Like(`%${inventory.product}%`) }
      })

    if (inventory.warehouse)
      where['warehouse'] = await getRepository(Warehouse).findOne({
        where: { ...commonCondition, name: Like(`%${inventory.warehouse}%`) }
      })

    if (inventory.location)
      where['location'] = await getRepository(Location).findOne({
        where: { ...commonCondition, name: Like(`%${inventory.location}%`) }
      })

    const [items, total] = await getRepository(Inventory).findAndCount({
      ...convertedParams,
      where,
      relations: ['domain', 'bizplace', 'product', 'warehouse', 'location', 'creator', 'updater']
    })

    return { items, total }
  }
}

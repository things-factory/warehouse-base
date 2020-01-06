import { Bizplace, getMyBizplace, getPermittedBizplaceIds } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'
import { convertListParams } from '@things-factory/shell'
import { getRepository, In, Raw } from 'typeorm'
import { InventoryHistory, Location, Warehouse } from '../../../entities'

export const warehouseInventoryHistories = {
  async warehouseInventoryHistories(_: any, { inventoryHistory, filters, pagination, sortings }, context: any) {
    const ownerBizplace: Bizplace = await getMyBizplace(context.state.user)

    const convertedParams = convertListParams({ filters, pagination, sortings })
    let where = { domain: context.state.domain }

    if (inventoryHistory && inventoryHistory.warehouseName) {
      const _warehouses: Warehouse[] = await getRepository(Warehouse).find({
        domain: context.state.domain,
        name: Raw(alias => `LOWER(${alias}) LIKE '${inventoryHistory.warehouseName.toLowerCase()}'`)
      })
      where['warehouseId'] = In(_warehouses.map((warehouse: Warehouse) => warehouse.id))
    }

    convertedParams.where = {
      ...convertedParams.where,
      ...where,
      bizplace: In(await getPermittedBizplaceIds(context.state.domain, context.state.user))
    }

    const result = await getRepository(InventoryHistory).findAndCount({
      ...convertedParams,
      relations: ['domain', 'bizplace', 'updater']
    })

    let items = result[0] as any
    let total = result[1]

    items = await Promise.all(
      items.map(async (item: InventoryHistory) => {
        return {
          seq: item.seq,
          palletId: item.palletId,
          batchId: item.batchId,
          bizplace: item.bizplace,
          orderRefNo: item.orderRefNo || '',
          orderNo: item.orderNo,
          qty: item.qty,
          status: item.status,
          transactionType: item.transactionType,
          product: await getRepository(Product).findOne({
            domain: context.state.domain,
            bizplace: In(await getPermittedBizplaceIds(context.state.domain, context.state.user)),
            id: item.productId
          }),
          warehouse: await getRepository(Warehouse).findOne({
            where: {
              domain: context.state.domain,
              bizplace: ownerBizplace,
              id: item.warehouseId
            }
          }),
          location: await getRepository(Location).findOne({
            where: {
              domain: context.state.domain,
              bizplace: ownerBizplace,
              id: item.locationId
            }
          }),
          zone: item.zone
        } as any
      })
    )

    return { items, total }
  }
}

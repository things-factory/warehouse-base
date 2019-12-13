import { Bizplace } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'
import { convertListParams } from '@things-factory/shell'
import { Between, getRepository, In, Raw } from 'typeorm'
import { InventoryHistory, Location, Warehouse } from '../../../entities'

export const bizplaceInventoryHistories = {
  async bizplaceInventoryHistories(_: any, { inventoryHistory, filters, pagination, sortings }, context: any) {
    const ownerBizplace: Bizplace = context.state.mainBizplace
    const customerBizplace: Bizplace = await getRepository(Bizplace).findOne({
      domain: context.state.domain,
      id: inventoryHistory.bizplace.id
    })

    const fromDate: Date = new Date(inventoryHistory.fromDate)
    let toDate: Date = new Date(inventoryHistory.toDate)
    toDate.setDate(toDate.getDate() + 1)

    const convertedParams = convertListParams({ filters, pagination, sortings })
    let where = { domain: context.state.domain }

    if (inventoryHistory && inventoryHistory.productName) {
      const _products: Product[] = await getRepository(Product).find({
        domain: context.state.domain,
        bizplace: customerBizplace,
        name: Raw(alias => `LOWER(${alias}) LIKE '${inventoryHistory.productName.toLowerCase()}'`)
      })
      where['productId'] = In(_products.map((product: Product) => product.id))
    }

    if (inventoryHistory && inventoryHistory.warehouseName) {
      const _warehouses: Warehouse[] = await getRepository(Warehouse).find({
        domain: context.state.domain,
        bizplace: ownerBizplace,
        name: Raw(alias => `LOWER(${alias}) LIKE '${inventoryHistory.warehouseName.toLowerCase()}'`)
      })
      where['warehouseId'] = In(_warehouses.map((warehouse: Warehouse) => warehouse.id))
    }

    if (inventoryHistory && inventoryHistory.locationName) {
      const _locations = await getRepository(Location).find({
        where: {
          domain: context.state.domain,
          bizplace: ownerBizplace,
          name: Raw(alias => `LOWER(${alias}) LIKE '${inventoryHistory.locationName.toLowerCase()}'`)
        }
      })
      where['locationId'] = In(_locations.map((location: Location) => location.id))
    }

    where['updatedAt'] = Between(fromDate.toISOString(), toDate.toISOString())
    convertedParams.where = {
      ...convertedParams.where,
      ...where,
      bizplace: customerBizplace
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
            bizplace: customerBizplace,
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
          zone: item.zone,
          updatedAt: item.updatedAt,
          updater: item.updater
        } as any
      })
    )

    return { items, total }
  }
}

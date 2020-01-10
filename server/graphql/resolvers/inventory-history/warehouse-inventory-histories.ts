import { Product } from '@things-factory/product-base'
import { ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { InventoryHistory, Location } from '../../../entities'

export const warehouseInventoryHistories = {
  async warehouseInventoryHistories(_: any, params: ListParam, context: any) {
    let warehouseFilter = params.filters.find(data => data.name === 'warehouse')

    const warehouseId = warehouseFilter.value
    const result = await getRepository(InventoryHistory)
      .createQueryBuilder('invh')
      .where('invh.warehouse_id = :warehouseId', { warehouseId })
      .andWhere('invh.domain_id = :domain', { domain: context.state.domain.id })
      .leftJoinAndSelect(Product, 'product', 'product.id::VARCHAR = invh.product_id')
      .leftJoinAndSelect(Location, 'location', 'location.id::VARCHAR = invh.location_id')
      .getMany()

    // let items = result as any
    // items = await Promise.all(
    //   items.map(async (item: InventoryHistory) => {
    //     return {
    //       seq: item.seq,
    //       palletId: item.palletId,
    //       batchId: item.batchId,
    //       bizplace: item.bizplace,
    //       qty: item.qty,
    //       status: item.status,
    //       transactionType: item.transactionType,
    //       product: await getRepository(Product).findOne({
    //         where: {
    //           domain: context.state.domain,
    //           id: item.productId
    //         }
    //       }),
    //       location: await getRepository(Location).findOne({
    //         where: {
    //           domain: context.state.domain,
    //           bizplace: ownerBizplace,
    //           id: item.locationId
    //         }
    //       }),
    //       zone: item.zone
    //     } as any
    //   })
    // )

    return { items: result }
  }
}

import { Bizplace } from '@things-factory/biz-base'
import { Worksheet } from '@things-factory/worksheet-base'
import { getRepository } from 'typeorm'
import { Inventory } from '../../../entities'

export const inventoriesByStrategyResolver = {
  async inventoriesByStrategy(
    _: any,
    { worksheetNo, batchId, productName, packingType, pickingStrategy },
    context: any
  ) {
    const worksheet: Worksheet = await getRepository(Worksheet).findOne({
      where: { domain: context.state.domain, name: worksheetNo },
      relations: ['bizplace']
    })
    const bizplace: Bizplace = worksheet.bizplace
    const qb = getRepository(Inventory).createQueryBuilder('INV')
    qb.leftJoinAndSelect('INV.product', 'PROD')
      .leftJoinAndSelect('INV.location', 'LOC')
      .addSelect(subQuery =>
        subQuery
          .select('COALESCE(SUM(release_qty), 0)', 'releaseQty')
          .from('order_inventories', 'OI')
          .where('"OI"."inventory_id" = "INV"."id"')
          .andWhere('"OI"."status" IN (\'PENDING\', \'PENDING_RECEIVE\', \'READY_TO_PICK\', \'PICKING\', \'PENDING_SPLIT\')')
      )
      .addSelect(subQuery =>
        subQuery
          .select('COALESCE(SUM(release_weight), 0)', 'releaseWeight')
          .from('order_inventories', 'OI')
          .where('"OI"."inventory_id" = "INV"."id"')
          .andWhere('"OI"."status" IN (\'PENDING\', \'PENDING_RECEIVE\', \'READY_TO_PICK\', \'PICKING\', \'PENDING_SPLIT\')')
      )
      .andWhere('"INV"."batch_id" = :batchId')
      .andWhere('"PROD"."name" = :productName')
      .andWhere('"INV"."packing_type" = :packingType')
      .andWhere('"INV"."status" = :status', { status: 'STORED' })
      .andWhere('"INV"."bizplace_id" = :bizplaceId', { bizplaceId: bizplace.id })
      .setParameters({
        batchId,
        productName,
        packingType
      })

    switch (pickingStrategy.toUpperCase()) {
      case 'FIFO':
        qb.orderBy('"INV"."created_at"', 'ASC')
        break

      case 'LILO':
        qb.orderBy('"INV"."created_at"', 'DESC')
        break
    }

    const { entities, raw } = await qb.getRawAndEntities()
    const items = entities
      .map((inv: Inventory, idx: number) => {
        const qty: number = inv.qty || 0
        const lockedQty: number = inv.lockedQty || 0
        const weight: number = inv.weight || 0
        const lockedWeight: number = inv.lockedWeight || 0
        const releaseQty: number = parseInt(raw[idx].releaseQty) || 0
        const releaseWeight: number = parseFloat(raw[idx].releaseWeight) || 0

        return {
          ...inv,
          qty: qty - lockedQty - releaseQty,
          weight: weight - lockedWeight - releaseWeight
        }
      })
      .filter((inv: Inventory) => inv.qty)

    const total: number = await qb.getCount()
    return { items, total }
  }
}

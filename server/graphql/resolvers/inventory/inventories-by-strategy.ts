import { getRepository } from 'typeorm'
import { Inventory } from '../../../entities'

export const inventoriesByStrategyResolver = {
  async inventoriesByStrategy(_: any, { batchId, productName, packingType, pickingStrategy }, context: any) {
    const qb = getRepository(Inventory).createQueryBuilder('INV')
    qb.leftJoinAndSelect('INV.product', 'PROD')
      .leftJoinAndSelect('INV.location', 'LOC')
      .addSelect(subQuery =>
        subQuery
          .select('COALESCE(SUM(release_qty), 0)', 'releaseQty')
          .from('order_inventories', 'OI')
          .where('"OI"."inventory_id" = "INV"."id"')
          .andWhere('"OI"."status" NOT IN (\'TERMINATED\', \'REJECTED\')')
      )
      .addSelect(subQuery =>
        subQuery
          .select('COALESCE(SUM(release_weight), 0)', 'releaseWeight')
          .from('order_inventories', 'OI')
          .where('"OI"."inventory_id" = "INV"."id"')
          .andWhere('"OI"."status" NOT IN (\'TERMINATED\', \'REJECTED\')')
      )
      .andWhere('"INV"."batch_id" = :batchId')
      .andWhere('"PROD"."name" = :productName')
      .andWhere('"INV"."packing_type" = :packingType')
      .andWhere('"INV"."status" = :status', { status: 'STORED' })
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

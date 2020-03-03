import { getRepository } from 'typeorm'
import { Inventory } from '../../../entities'

export const inventoriesByStrategyResolver = {
  async inventoriesByStrategy(_: any, { batchId, productName, packingType, pickingStrategy }, context: any) {
    const qb = getRepository(Inventory).createQueryBuilder('INV')
    qb.leftJoinAndSelect('INV.product', 'PROD')
      .leftJoinAndSelect('INV.location', 'LOC')
      .andWhere('"INV"."batch_id" = :batchId')
      .andWhere('"PROD"."name" = :productName')
      .andWhere('"INV"."packing_type" = :packingType')
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

    const [items, total] = await qb.getManyAndCount()
    return { items, total }
  }
}

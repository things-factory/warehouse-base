import { Inventory } from '../../../entities'
import { SelectQueryBuilder, createQueryBuilder } from 'typeorm'
import { buildQuery } from '@things-factory/shell'

export const inventoryProductGroupResolver = {
  async inventoryProductGroup(_: any, { filters, pagination, sortings, locationSortingRules }, context: any) {
    const qb: SelectQueryBuilder<Inventory> = createQueryBuilder(Inventory, 'INV')
    buildQuery(qb, { filters, pagination, sortings }, context)
    qb.addSelect('"INV"."batch_id"', 'batchId')
      .addSelect('"INV"."packing_type"', 'productType')
      .addSelect('"PROD"."name"', 'productName')
      .addSelect('SUM(COALESCE("INV"."qty", 0) - COALESCE("INV"."locked_qty", 0)) as remainQty')
      .addSelect('SUM(COALESCE("INV"."weight", 0) - COALESCE("INV"."locked_weight", 0)) as remainWeight')
      .leftJoin('INV.product', 'PROD')
      .leftJoin('INV.location', 'LOC')
      .groupBy('INV.batch_id')
      .addGroupBy('INV.packing_type')
      .addGroupBy('PROD.id')

    if (locationSortingRules?.length > 0) {
      locationSortingRules.forEach((rule: { name: string; desc: boolean }) => {
        qb.addOrderBy(`LOC.${rule.name}`, rule.desc ? 'DESC' : 'ASC')
      })
    }

    const [items, total] = await qb.getManyAndCount()
    return { items, total }
  }
}

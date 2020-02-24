import { getPermittedBizplaceIds } from '@things-factory/biz-base'
import { buildQuery } from '@things-factory/shell'
import { getRepository, SelectQueryBuilder } from 'typeorm'
import { Inventory } from '../../../entities'

export const inventoriesResolver = {
  async inventories(_: any, { filters, pagination, sortings, locationSortingRules }, context: any) {
    const params = { filters, pagination, sortings }
    if (!params.filters.find((filter: any) => filter.name === 'bizplace')) {
      params.filters.push({
        name: 'bizplace',
        operator: 'in',
        value: await getPermittedBizplaceIds(context.state.domain, context.state.user),
        relation: true
      })
    }

    const remainOnlyParam: { name: string; operator: string; value: boolean } = params?.filters?.find(
      (f: { name: string; operator: string; value: any }) => f.name === 'remainOnly'
    )

    let remainOnly: boolean = false
    if (typeof remainOnlyParam?.value !== 'undefined') {
      remainOnly = remainOnlyParam.value
      params.filters = params.filters.filter(
        (f: { name: string; operator: string; value: any }) => f.name !== 'remainOnly'
      )
    }

    const qb: SelectQueryBuilder<Inventory> = getRepository(Inventory).createQueryBuilder('iv')
    buildQuery(qb, params, context)

    qb.leftJoinAndSelect('iv.domain', 'domain')
      .leftJoinAndSelect('iv.bizplace', 'bizplace')
      .leftJoinAndSelect('iv.product', 'product')
      .leftJoinAndSelect('iv.warehouse', 'warehouse')
      .leftJoinAndSelect('iv.location', 'location')
      .leftJoinAndSelect('iv.creator', 'creator')
      .leftJoinAndSelect('iv.updater', 'updater')

    if (remainOnly) {
      qb.andWhere('iv.qty > 0')
        .andWhere('CASE WHEN iv.lockedQty IS NULL THEN 0 ELSE iv.lockedQty END >= 0')
        .andWhere('iv.qty - CASE WHEN iv.lockedQty IS NULL THEN 0 ELSE iv.lockedQty END > 0')
    }

    if (locationSortingRules?.length > 0) {
      locationSortingRules.forEach((rule: { name: string; desc: boolean }) => {
        qb.addOrderBy(`location.${rule.name}`, rule.desc ? 'DESC' : 'ASC')
      })
    }

    let [items, total] = await qb.getManyAndCount()

    items = items.map((item: Inventory) => {
      const remainQty: number = item.qty && item.lockedQty ? item.qty - item.lockedQty : item.qty || 0
      const remainWeight: number = item.weight && item.lockedWeight ? item.weight - item.lockedWeight : item.weight || 0

      return {
        ...item,
        remainQty,
        remainWeight
      }
    })

    return { items, total }
  }
}

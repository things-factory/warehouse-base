import { getPermittedBizplaceIds } from '@things-factory/biz-base'
import { buildQuery } from '@things-factory/shell'
import { getRepository, SelectQueryBuilder } from 'typeorm'
import { Inventory, InventoryChange } from '../../../entities'

export const inventoriesResolver = {
  async inventories(_: any, { filters, pagination, sortings, locationSortingRules }, context: any) {
    const params = { filters, pagination }
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

    const unlockOnlyParam: { name: string; operator: string; value: boolean } = params?.filters?.find(
      (f: { name: string; operator: string; value: any }) => f.name === 'unlockOnly'
    )

    let unlockOnly: boolean = false
    if (typeof unlockOnlyParam?.value !== 'undefined') {
      unlockOnly = unlockOnlyParam.value
      params.filters = params.filters.filter(
        (f: { name: string; operator: string; value: any }) => f.name !== 'unlockOnly'
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

    if (unlockOnly) {
      qb.andWhere('CASE WHEN iv.lockedQty IS NULL THEN 0 ELSE iv.lockedQty END = 0')
    }

    if (sortings?.length !== 0) {
      const arrChildSortData = ['bizplace', 'product', 'location', 'warehouse', 'zone']
      const sort = (sortings || []).reduce(
        (acc, sort) => ({
          ...acc,
          [arrChildSortData.indexOf(sort.name) >= 0 ? sort.name + '.name' : 'iv.' + sort.name]: sort.desc
            ? 'DESC'
            : 'ASC'
        }),
        {}
      )
      qb.orderBy(sort)
    }

    if (locationSortingRules?.length > 0) {
      locationSortingRules.forEach((rule: { name: string; desc: boolean }) => {
        qb.addOrderBy(`location.${rule.name}`, rule.desc ? 'DESC' : 'ASC')
      })
    }

    let [items, total] = await qb.getManyAndCount()

    items = await Promise.all(
      items.map(async (item: Inventory) => {
        // const { remainQty, remainWeight } = await getRemainAmount(item)

        let inventoryChangeCount = await getRepository(InventoryChange).count({
          where: { inventory: item.id }
        })

        const selectedQty = item.lockedQty ? item.lockedQty : 0
        const selectedWeight = item.lockedWeight ? item.lockedWeight : 0

        return {
          ...item,
          changeCount: inventoryChangeCount,
          remainQty: item.qty - selectedQty,
          remainWeight: item.weight - selectedWeight
        }
      })
    )

    // items = items.map((item: Inventory) => {
    //   const remainQty: number = item.qty && item.lockedQty ? item.qty - item.lockedQty : item.qty || 0
    //   const remainWeight: number = item.weight && item.lockedWeight ? item.weight - item.lockedWeight : item.weight || 0

    //   return {
    //     ...item,
    //     remainQty,
    //     remainWeight
    //   }
    // })

    return { items, total }
  }
}

// async function getRemainAmount(inventory: Inventory): Promise<{ remainQty: number; remainWeight: number }> {
//   const orderInventories: OrderInventory = await getRepository(OrderInventory).find({
//     where: {
//       inventory,
//       status: In([
//         ORDER_INVENTORY_STATUS.PENDING,
//         ORDER_INVENTORY_STATUS.PENDING_RECEIVE,
//         ORDER_INVENTORY_STATUS.READY_TO_PICK,
//         ORDER_INVENTORY_STATUS.PICKING,
//         ORDER_INVENTORY_STATUS.PENDING_SPLIT
//       ])
//     }
//   })

//   const { releaseQty, releaseWeight } = orderInventories.reduce(
//     (releaseAmount: { releaseQty: number; releaseWeight: number }, orderInv: OrderInventory) => {
//       releaseAmount.releaseQty += orderInv.releaseQty
//       releaseAmount.releaseWeight += orderInv.releaseWeight
//       return releaseAmount
//     },
//     { releaseQty: 0, releaseWeight: 0 }
//   )

//   return { remainQty: inventory.qty - releaseQty, remainWeight: inventory.weight - releaseWeight }
// }

import { getPermittedBizplaceIds } from '@things-factory/biz-base'
import { convertListParams, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Inventory } from '../../../entities'

export const inventoriesResolver = {
  async inventories(_: any, params: ListParam, context: any) {
    if (!params.filters.find((filter: any) => filter.name === 'bizplace')) {
      params.filters.push({
        name: 'bizplace',
        operator: 'in',
        value: await getPermittedBizplaceIds(context.state.domain, context.state.user)
      })
    }

    const convertedParams = convertListParams(params)
    let [items, total] = await getRepository(Inventory).findAndCount({
      ...convertedParams,
      relations: ['domain', 'bizplace', 'product', 'warehouse', 'location', 'creator', 'updater']
    })

    items = items
      .map((item: Inventory) => {
        const remainQty: number = item.qty && item.lockedQty ? item.qty - item.lockedQty : item.qty || 0
        const remainWeight: number =
          item.weight && item.lockedWeight ? item.weight - item.lockedWeight : item.weight || 0

        return {
          ...item,
          remainQty,
          remainWeight
        }
      })
      .filter((item: any) => item.remainQty > 0 || item.remainWeight > 0)

    return { items, total }
  }
}

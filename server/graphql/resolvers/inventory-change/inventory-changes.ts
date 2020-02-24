import { ListParam, convertListParams } from '@things-factory/shell'
import { getPermittedBizplaceIds } from '@things-factory/biz-base'
import { getRepository, SelectQueryBuilder } from 'typeorm'
import { InventoryChange } from '../../../entities'

export const inventoryChangesResolver = {
  async inventoryChanges(_: any, params: ListParam, context: any) {
    if (!params.filters.find((filter: any) => filter.name === 'bizplace')) {
      params.filters.push({
        name: 'bizplace',
        operator: 'in',
        value: await getPermittedBizplaceIds(context.state.domain, context.state.user)
      })
    }

    const convertedParams = convertListParams(params, context.state.domain.id)
    const [items, total] = await getRepository(InventoryChange).findAndCount({
      ...convertedParams,
      relations: [
        'bizplace',
        'inventory',
        'product',
        'location',
        'oriBizplace',
        'oriProduct',
        'oriLocation',
        'domain',
        'creator',
        'updater'
      ]
    })

    return { items, total }
  }

  // async inventoryChanges(_: any, params: ListParam, context: any) {
  //   const convertedParams = convertListParams(params)
  //   const [items, total] = await getRepository(InventoryChange).findAndCount({
  //     ...convertedParams,
  //     relations: ['domain', 'creator', 'updater']
  //   })
  //   return { items, total }
  // }
}

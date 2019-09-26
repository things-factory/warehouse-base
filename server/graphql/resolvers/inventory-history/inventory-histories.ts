import { convertListParams, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { InventoryHistory } from '../../../entities'

export const inventoryHistoriesResolver = {
  async inventoryHistories(_: any, params: ListParam, context: any) {
    const convertedParams = convertListParams(params)
    const [items, total] = await getRepository(InventoryHistory).findAndCount({
      ...convertedParams,
      relations: ['domain', 'creator', 'updater']
    })
    return { items, total }
  }
}

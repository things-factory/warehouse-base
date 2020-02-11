import { ListParam, convertListParams } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { InventoryChange } from '../../../entities'

export const inventoryChangesResolver = {
  async inventoryChanges(_: any, params: ListParam, context: any) {
    const convertedParams = convertListParams(params)
    const [items, total] = await getRepository(InventoryChange).findAndCount({
      ...convertedParams,
      relations: ['domain', 'creator', 'updater']
    })
    return { items, total }
  }
}
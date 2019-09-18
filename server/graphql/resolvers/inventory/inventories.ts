import { convertListParams, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Inventory } from '../../../entities'

export const inventoriesResolver = {
  async vass(_: any, params: ListParam, context: any) {
    const convertedParams = convertListParams(params)

    const [items, total] = await getRepository(Inventory).findAndCount({
      ...convertedParams,
      relations: ['domain', 'product', 'location', 'movement', 'creator', 'updater']
    })

    return { items, total }
  }
}

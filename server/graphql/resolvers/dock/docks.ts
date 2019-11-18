import { ListParam, convertListParams } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Dock } from '../../../entities'

export const docksResolver = {
  async docks(_: any, params: ListParam, context: any) {
    const convertedParams = convertListParams(params)
    const [items, total] = await getRepository(Dock).findAndCount({
      ...convertedParams,
      relations: ['domain', 'warehouse', 'creator', 'updater']
    })
    return { items, total }
  }
}

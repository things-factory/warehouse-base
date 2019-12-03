import { convertListParams, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Warehouse } from '../../../entities'

export const warehousesResolver = {
  async warehouses(_: any, params: ListParam, context: any) {
    const convertedParams = convertListParams(params)
    const [items, total] = await getRepository(Warehouse).findAndCount({
      ...convertedParams,
      relations: ['domain', 'creator', 'updater']
    })
    return { items, total }
  }
}

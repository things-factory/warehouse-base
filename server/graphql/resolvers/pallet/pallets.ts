import { ListParam, convertListParams } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Pallet } from '../../../entities'

export const palletsResolver = {
  async pallets(_: any, params: ListParam, context: any) {
    if (!params.filters.find((filter: any) => filter.name === 'status')) {
      params.filters.push({
        name: 'status',
        operator: 'noteq',
        value: 'TERMINATED'
      })
    }

    const convertedParams = convertListParams(params)
    const [items, total] = await getRepository(Pallet).findAndCount({
      ...convertedParams,
      relations: ['owner', 'holder', 'domain', 'creator', 'updater']
    })
    return { items, total }
  }
}

import { ListParam, convertListParams } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Pallet } from '../../../entities'

export const palletsResolver = {
  async pallets(_: any, params: ListParam, context: any) {
    const convertedParams = convertListParams(params)
    const [items, total] = await getRepository(Pallet).findAndCount({
      ...convertedParams,
      relations: ['owner', 'holder', 'domain', 'creator', 'updater']
    })
    return { items, total }
  }
}

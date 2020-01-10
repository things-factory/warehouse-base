import { ListParam, convertListParams } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { PalletHistory } from '../../../entities'

export const palletHistoriesResolver = {
  async palletHistories(_: any, params: ListParam, context: any) {
    const convertedParams = convertListParams(params)
    const [items, total] = await getRepository(PalletHistory).findAndCount({
      ...convertedParams,
      relations: ['domain', 'creator', 'updater']
    })
    return { items, total }
  }
}
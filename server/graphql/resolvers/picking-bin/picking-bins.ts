import { ListParam, convertListParams } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { PickingBin } from '../../../entities'

export const pickingBinsResolver = {
  async pickingBins(_: any, params: ListParam, context: any) {
    const convertedParams = convertListParams(params, context.state.domain.id)
    const [items, total] = await getRepository(PickingBin).findAndCount({
      ...convertedParams,
      relations: ['domain', 'creator', 'updater']
    })
    return { items, total }
  }
}
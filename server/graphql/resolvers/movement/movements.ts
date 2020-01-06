import { getPermittedBizplaceIds } from '@things-factory/biz-base'
import { convertListParams, ListParam } from '@things-factory/shell'
import { getRepository, In } from 'typeorm'
import { Movement } from '../../../entities'

export const movementsResolver = {
  async movements(_: any, params: ListParam, context: any) {
    const convertedParams = convertListParams(params)
    convertedParams.where.bizplace = In(await getPermittedBizplaceIds(context.state.domain, context.state.user))

    const [items, total] = await getRepository(Movement).findAndCount({
      ...convertedParams,
      relations: ['domain', 'bizplace', 'inventory', 'creator', 'updater']
    })
    return { items, total }
  }
}

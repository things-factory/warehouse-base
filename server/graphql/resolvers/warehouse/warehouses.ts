import { getUserBizplaces } from '@things-factory/biz-base'
import { convertListParams, ListParam } from '@things-factory/shell'
import { getRepository, In } from 'typeorm'
import { Warehouse } from '../../../entities'

export const warehousesResolver = {
  async warehouses(_: any, params: ListParam, context: any) {
    const convertedParams = convertListParams(params)
    const userBizplaces = await getUserBizplaces(context)
    convertedParams.where.bizplace = In(userBizplaces.map(userBizplace => userBizplace.id))

    const [items, total] = await getRepository(Warehouse).findAndCount({
      ...convertedParams,
      relations: ['domain', 'bizplace', 'locations', 'creator', 'updater']
    })
    return { items, total }
  }
}

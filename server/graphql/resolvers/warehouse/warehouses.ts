import { Bizplace } from '@things-factory/biz-base'
import { convertListParams, ListParam } from '@things-factory/shell'
import { getRepository, In } from 'typeorm'
import { Warehouse } from '../../../entities'

export const warehousesResolver = {
  async warehouses(_: any, params: ListParam, context: any) {
    const convertedParams = convertListParams(params)
    convertedParams.where.bizplace = In(context.state.bizplaces.map((bizplace: Bizplace) => bizplace.id))

    const [items, total] = await getRepository(Warehouse).findAndCount({
      ...convertedParams,
      relations: ['domain', 'bizplace', 'locations', 'creator', 'updater']
    })
    return { items, total }
  }
}

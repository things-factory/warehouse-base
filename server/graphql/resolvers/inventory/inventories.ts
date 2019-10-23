import { Bizplace } from '@things-factory/biz-base'
import { convertListParams, ListParam } from '@things-factory/shell'
import { getRepository, In } from 'typeorm'
import { Inventory } from '../../../entities'

export const inventoriesResolver = {
  async inventories(_: any, params: ListParam, context: any) {
    const convertedParams = convertListParams(params)
    convertedParams.where = {
      ...convertedParams.where,
      domain: context.state.domain,
      bizplace: In(context.state.bizplaces.map((bizplace: Bizplace) => bizplace.id))
    }

    const [items, total] = await getRepository(Inventory).findAndCount({
      ...convertedParams,
      relations: ['domain', 'bizplace', 'product', 'warehouse', 'location', 'creator', 'updater']
    })

    return { items, total }
  }
}

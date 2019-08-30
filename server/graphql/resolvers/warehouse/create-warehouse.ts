import { Bizplace, getUserBizplaces } from '@things-factory/biz-base'
import { getRepository } from 'typeorm'
import { Warehouse } from '../../../entities'

export const createWarehouse = {
  async createWarehouse(_: any, { warehouse }, context: any) {
    if (warehouse.bizplace && warehouse.bizplace.id) {
      warehouse.bizplace = await getRepository(Bizplace).findOne(warehouse.bizplace.id)
    } else {
      const userBizplaces = await getUserBizplaces(context)
      warehouse.bizplace = userBizplaces[0]
    }

    return await getRepository(Warehouse).save({
      ...warehouse,
      domain: context.domain,
      creator: context.state.user,
      updater: context.state.user
    })
  }
}

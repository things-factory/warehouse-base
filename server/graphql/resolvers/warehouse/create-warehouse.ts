import { Bizplace } from '@things-factory/biz-base'
import { getRepository } from 'typeorm'
import { Warehouse } from '../../../entities'

export const createWarehouse = {
  async createWarehouse(_: any, { warehouse }, context: any) {
    if (warehouse.bizplace && warehouse.bizplace.id) {
      warehouse.bizplace = await getRepository(Bizplace).findOne(warehouse.bizplace.id)
    } else {
      warehouse.bizplace = context.state.bizplaces[0]
    }

    return await getRepository(Warehouse).save({
      ...warehouse,
      domain: context.state.domain,
      creator: context.state.user,
      updater: context.state.user
    })
  }
}

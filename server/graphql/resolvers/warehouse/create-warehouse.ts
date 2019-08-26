import { getRepository } from 'typeorm'
import { Warehouse } from '../../../entities'
import { Bizplace } from '@things-factory/biz-base'

export const createWarehouse = {
  async createWarehouse(_: any, { warehouse }, context: any) {
    if (warehouse.bizplace && warehouse.bizplace.id) {
      warehouse.bizplace = await getRepository(Bizplace).findOne(warehouse.bizplace.id)
    }

    return await getRepository(Warehouse).save({
      ...warehouse,
      domain: context.domain,
      creator: context.state.user,
      updater: context.state.user
    })
  }
}

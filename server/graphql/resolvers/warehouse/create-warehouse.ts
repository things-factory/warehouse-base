import { getRepository } from 'typeorm'
import { Warehouse } from '../../../entities'
import { Bizplace } from '@things-factory/biz-base'

export const createWarehouse = {
  async createWarehouse(_: any, { warehouse }, context: any) {
    return await getRepository(Warehouse).save({
      domain: context.domain,
      bizplace: await getRepository(Bizplace).findOne({ where: { name: warehouse.bizplace } }),
      ...warehouse,
      creator: context.state.user,
      updater: context.state.user
    })
  }
}

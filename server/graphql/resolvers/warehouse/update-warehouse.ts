import { getRepository } from 'typeorm'
import { Warehouse } from '../../../entities'
import { Bizplace } from '@things-factory/biz-base'

export const updateWarehouse = {
  async updateWarehouse(_: any, { name, patch }, context: any) {
    const warehouse = await getRepository(Warehouse).findOne({ domain: context.domain, name })

    if (patch.bizplace && patch.bizplace.id) {
      patch.bizplace = await getRepository(Bizplace).findOne(patch.bizplace.id)
    }

    return await getRepository(Warehouse).save({
      ...warehouse,
      ...patch,
      updater: context.state.user
    })
  }
}

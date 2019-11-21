import { getPermittedBizplaceIds } from '@things-factory/biz-base'
import { getRepository, In } from 'typeorm'
import { Warehouse } from '../../../entities'

export const updateWarehouse = {
  async updateWarehouse(_: any, { id, patch }, context: any) {
    const warehouse = await getRepository(Warehouse).findOne({
      where: {
        domain: context.state.domain,
        id,
        bizplace: In(await getPermittedBizplaceIds(context.state.domain, context.state.user))
      }
    })

    return await getRepository(Warehouse).save({
      ...warehouse,
      ...patch,
      updater: context.state.user
    })
  }
}

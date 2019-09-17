import { getRepository, In } from 'typeorm'
import { Warehouse } from '../../../entities'
import { Bizplace } from '@things-factory/biz-base'

export const updateWarehouse = {
  async updateWarehouse(_: any, { name, patch }, context: any) {
    const warehouse = await getRepository(Warehouse).findOne({
      where: {
        domain: context.state.domain,
        name,
        bizplace: In(context.state.bizplaces.map((bizplace: Bizplace) => bizplace.id))
      }
    })

    return await getRepository(Warehouse).save({
      ...warehouse,
      ...patch,
      updater: context.state.user
    })
  }
}

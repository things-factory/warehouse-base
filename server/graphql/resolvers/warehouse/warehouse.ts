import { getPermittedBizplaceIds } from '@things-factory/biz-base'
import { getRepository, In } from 'typeorm'
import { Warehouse } from '../../../entities'

export const warehouseResolver = {
  async warehouse(_: any, { name }, context: any) {
    return await getRepository(Warehouse).findOne({
      where: {
        domain: context.state.domain,
        name,
        bizplace: In(await getPermittedBizplaceIds(context.state.domain, context.state.user))
      },
      relations: ['domain', 'bizplace', 'locations', 'creator', 'updater']
    })
  }
}

import { getPermittedBizplaceIds } from '@things-factory/biz-base'
import { getRepository, In } from 'typeorm'
import { Inventory, Movement } from '../../../entities'

export const updateMovement = {
  async updateMovement(_: any, { id, patch }, context: any) {
    const movement = await getRepository(Movement).findOne({
      where: {
        domain: context.state.domain,
        id,
        bizplace: In(await getPermittedBizplaceIds(context.state.domain, context.state.user))
      }
    })

    if (patch.inventory && patch.inventory.id) {
      patch.inventory = await getRepository(Inventory).findOne(patch.inventory.id)
    }

    return await getRepository(Movement).save({
      ...movement,
      ...patch,
      updater: context.state.user
    })
  }
}

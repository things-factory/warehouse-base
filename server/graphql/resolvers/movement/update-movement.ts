import { getRepository, In } from 'typeorm'
import { Movement, Inventory } from '../../../entities'
import { Bizplace } from '@things-factory/biz-base'

export const updateMovement = {
  async updateMovement(_: any, { name, patch }, context: any) {
    const movement = await getRepository(Movement).findOne({
      where: {
        domain: context.state.domain,
        name,
        bizplace: In(context.state.bizplaces.map((bizplace: Bizplace) => bizplace.id))
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

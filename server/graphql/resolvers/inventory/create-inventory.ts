import { getRepository } from 'typeorm'
import { Inventory } from '../../../entities'

export const createInventory = {
  async createInventory(_: any, { inventory }, context: any) {
    return await getRepository(Inventory).save({
      domain: context.domain,
      creatorId: context.state.user.id,
      updaterId: context.state.user.id,
      ...inventory
    })
  }
}

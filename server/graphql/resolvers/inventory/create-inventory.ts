import { getRepository } from 'typeorm'
import { Inventory } from '../../../entities'

export const createInventory = {
  async createInventory(_: any, { inventory }, context: any) {
    return await getRepository(Inventory).save({
      domain: context.domain,
      creator: context.state.user,
      updater: context.state.user,
      ...inventory
    })
  }
}

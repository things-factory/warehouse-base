import { getRepository } from 'typeorm'
import { Inventory } from '../../../entities'

export const inventoryResolver = {
  async inventory(_, { id }, context, info) {
    const repository = getRepository(Inventory)

    return await repository.findOne(
      { id },
      {
        relations: ['inventoryDetails']
      }
    )
  }
}

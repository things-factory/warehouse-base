import { getRepository } from 'typeorm'
import { Warehouse } from '../../../entities'

export const warehouseResolver = {
  async warehouse(_, { id }, context, info) {
    const repository = getRepository(Warehouse)

    return await repository.findOne(
      { id },
      {
        relations: ['warehouseDetails']
      }
    )
  }
}

import { getRepository } from 'typeorm'
import { Warehouse } from '../../../entities'

export const updateWarehouse = {
  async updateWarehouse(_, { id, patch }) {
    const repository = getRepository(Warehouse)

    const warehouse = await repository.findOne({ id })

    return await repository.save({
      ...warehouse,
      ...patch
    })
  }
}

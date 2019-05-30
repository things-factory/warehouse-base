import { getRepository } from 'typeorm'
import { Warehouse } from '../../../entities'

export const warehousesResolver = {
  async warehouses() {
    const repository = getRepository(Warehouse)

    return await repository.find()
  }
}

import { getRepository } from 'typeorm'
import { Location, Warehouse } from '../../../entities'

export const deleteAllLocations = {
  async deleteAllLocations(_: any, { warehouseId }, _context: any) {
    return await getRepository(Location).delete({
      warehouse: await getRepository(Warehouse).findOne(warehouseId)
    })
  }
}

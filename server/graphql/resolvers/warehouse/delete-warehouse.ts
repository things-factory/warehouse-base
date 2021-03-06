import { EntityManager, getRepository, Repository } from 'typeorm'
import { Warehouse } from '../../../entities'

export const deleteWarehouseResolver = {
  async deleteWarehouse(_: any, { id }, _context: any) {
    await deleteWarehouse(id)
  }
}

export async function deleteWarehouse(id: string, trxMgr?: EntityManager) {
  const repository: Repository<Warehouse> = trxMgr ? trxMgr.getRepository(Warehouse) : getRepository(Warehouse)
  await repository.delete(id)
  return true
}

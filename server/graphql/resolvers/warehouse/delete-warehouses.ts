import { EntityManager, getRepository, Repository } from 'typeorm'
import { Warehouse } from '../../../entities'

export const deleteWarehousesResolver = {
  async deleteWarehouses(_: any, { ids }) {
    return await deleteWarehouses(ids)
  }
}

export async function deleteWarehouses(ids: string[], trxMgr?: EntityManager) {
  const repository: Repository<Warehouse> = trxMgr ? trxMgr.getRepository(Warehouse) : getRepository(Warehouse)
  return await repository.delete(ids)
}

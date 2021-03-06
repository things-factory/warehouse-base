import { User } from '@things-factory/auth-base'
import { EntityManager, getRepository, Repository } from 'typeorm'
import { Warehouse } from '../../../entities'

export const updateWarehouseResolver = {
  async updateWarehouse(_: any, { id, patch }, context: any) {
    return await updateWarehouse(id, patch, context.state.user)
  }
}

export async function updateWarehouse(id: string, patch: Warehouse, user: User, trxMgr?: EntityManager) {
  const repository: Repository<Warehouse> = trxMgr ? trxMgr.getRepository(Warehouse) : getRepository(Warehouse)
  const warehouse = await repository.findOne(id)

  return await repository.save({
    ...warehouse,
    ...patch,
    updater: user
  })
}

import { User } from '@things-factory/auth-base'
import { Domain } from '@things-factory/shell'
import { EntityManager, getRepository, Repository } from 'typeorm'
import { Warehouse } from '../../../entities'

export const createWarehouseResolver = {
  async createWarehouse(_: any, { warehouse }, context: any) {
    return await createWarehouse(warehouse, context.state.domain, context.state.user)
  }
}

export async function createWarehouse(warehouse: Warehouse, domain: Domain, user: User, trxMgr?: EntityManager) {
  const repository: Repository<Warehouse> = trxMgr ? trxMgr.getRepository(Warehouse) : getRepository(Warehouse)
  return repository.save({
    ...warehouse,
    domain,
    creator: user,
    updater: user
  })
}

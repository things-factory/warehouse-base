import { User } from '@things-factory/auth-base'
import { Domain } from '@things-factory/shell'
import { EntityManager, getRepository, Repository } from 'typeorm'
import { Location, Warehouse } from '../../../entities'
import { createWarehouse } from '../warehouse'

export const createLocationResolver = {
  async createLocation(_: any, { location }, context: any) {
    return await createWarehouse(location, context.state.domain, context.state.user)
  }
}

export async function createLocation(location: Location, domain: Domain, user: User, trxMgr?: EntityManager) {
  const locationRepository: Repository<Location> = trxMgr ? trxMgr.getRepository(Location) : getRepository(Location)
  const warehouseRepository: Repository<Warehouse> = trxMgr ? trxMgr.getRepository(Warehouse) : getRepository(Warehouse)

  return await locationRepository.save({
    ...location,
    warehouse: await warehouseRepository.findOne(location.warehouse.id),
    domain,
    creator: user,
    updater: user
  })
}

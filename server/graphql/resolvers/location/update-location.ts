import { User } from '@things-factory/auth-base'
import { EntityManager, getRepository, Repository } from 'typeorm'
import { Location, Warehouse } from '../../../entities'

export const updateLocationResolver = {
  async updateLocation(_: any, { id, patch }, context: any) {
    return await updateLocation(id, patch, context.state.user)
  }
}

export async function updateLocation(id: string, patch: Location, user: User, trxMgr?: EntityManager) {
  const locationRepository: Repository<Location> = trxMgr ? trxMgr.getRepository(Location) : getRepository(Location)
  const warehouseRepository: Repository<Warehouse> = trxMgr ? trxMgr.getRepository(Warehouse) : getRepository(Warehouse)
  const location: Location = await locationRepository.findOne(id)

  if (patch.warehouse && patch.warehouse.id) {
    patch.warehouse = await warehouseRepository.findOne(patch.warehouse.id)
  }

  return await locationRepository.save({
    ...location,
    patch,
    updater: user
  })
}

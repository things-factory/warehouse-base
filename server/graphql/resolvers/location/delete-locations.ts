import { EntityManager, getRepository, Repository } from 'typeorm'
import { Location } from '../../../entities'

export const deleteLocationsResolver = {
  async deleteLocations(_: any, { ids }, _context: any) {
    await deleteLocations(ids)
  }
}

export async function deleteLocations(ids: string[], trxMgr?: EntityManager) {
  const repository: Repository<Location> = trxMgr ? trxMgr.getRepository(Location) : getRepository(Location)
  await repository.delete(ids)
  return true
}

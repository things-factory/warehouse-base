import { EntityManager, getRepository, Repository } from 'typeorm'
import { Location } from '../../../entities'

export const deleteLocationResolver = {
  async deleteLocation(_: any, { id }, _context: any) {
    return await deleteLocation(id)
  }
}

export async function deleteLocation(id: string, trxMgr?: EntityManager) {
  const repository: Repository<Location> = trxMgr ? trxMgr.getRepository(Location) : getRepository(Location)
  return await repository.delete(id)
}

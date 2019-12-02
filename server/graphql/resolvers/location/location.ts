import { getRepository } from 'typeorm'
import { Location } from '../../../entities'

export const locationResolver = {
  async location(_: any, { id }, _context: any) {
    return await getRepository(Location).findOne(id, {
      relations: ['domain', 'warehouse', 'creator', 'updater']
    })
  }
}

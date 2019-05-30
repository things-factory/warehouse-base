import { getRepository } from 'typeorm'
import { Location } from '../../../entities'

export const updateLocation = {
  async updateLocation(_, { id, patch }) {
    const repository = getRepository(Location)

    const location = await repository.findOne({ id })

    return await repository.save({
      ...location,
      ...patch
    })
  }
}

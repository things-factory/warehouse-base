import { getRepository } from 'typeorm'
import { Location } from '../../../entities'

export const deleteLocation = {
  async deleteLocation(_, { id }) {
    const repository = getRepository(Location)

    return await repository.delete(id)
  }
}

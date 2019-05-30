import { getRepository } from 'typeorm'
import { Location } from '../../../entities'

export const locationResolver = {
  async location(_, { id }, context, info) {
    const repository = getRepository(Location)

    return await repository.findOne(
      { id },
      {
        relations: ['locationDetails']
      }
    )
  }
}

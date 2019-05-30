import { getRepository } from 'typeorm'
import { Location } from '../../../entities'

export const locationsResolver = {
  async locations() {
    const repository = getRepository(Location)

    return await repository.find()
  }
}

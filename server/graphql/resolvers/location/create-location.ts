import uuid from 'uuid/v4'

import { getRepository } from 'typeorm'
import { Location } from '../../../entities'

export const createLocation = {
  async createLocation(_, { location: attrs }) {
    const repository = getRepository(Location)
    const newLocation = {
      id: uuid(),
      ...attrs
    }

    return await repository.save(newLocation)
  }
}

import uuid from 'uuid/v4'

import { getRepository } from 'typeorm'
import { Movement } from '../../../entities'

export const createMovement = {
  async createMovement(_, { movement: attrs }) {
    const repository = getRepository(Movement)
    const newMovement = {
      id: uuid(),
      ...attrs
    }

    return await repository.save(newMovement)
  }
}

import { getRepository } from 'typeorm'
import { Movement } from '../../../entities'

export const movementResolver = {
  async movement(_, { id }, context, info) {
    const repository = getRepository(Movement)

    return await repository.findOne(
      { id }
    )
  }
}

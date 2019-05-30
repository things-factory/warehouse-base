import { getRepository } from 'typeorm'
import { Movement } from '../../../entities'

export const deleteMovement = {
  async deleteMovement(_, { id }) {
    const repository = getRepository(Movement)

    return await repository.delete(id)
  }
}

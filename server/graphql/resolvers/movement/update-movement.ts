import { getRepository } from 'typeorm'
import { Movement } from '../../../entities'

export const updateMovement = {
  async updateMovement(_, { id, patch }) {
    const repository = getRepository(Movement)

    const movement = await repository.findOne({ id })

    return await repository.save({
      ...movement,
      ...patch
    })
  }
}

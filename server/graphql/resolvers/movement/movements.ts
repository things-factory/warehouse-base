import { getRepository } from 'typeorm'
import { Movement } from '../../../entities'

export const movementsResolver = {
  async movements() {
    const repository = getRepository(Movement)

    return await repository.find()
  }
}

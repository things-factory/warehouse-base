import { getRepository } from 'typeorm'
import { Container } from '../../../entities'

export const containerResolver = {
  async container(_, { id }, context, info) {
    const repository = getRepository(Container)

    return await repository.findOne(
      { id }
    )
  }
}

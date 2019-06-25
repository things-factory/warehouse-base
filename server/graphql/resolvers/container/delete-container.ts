import { getRepository } from 'typeorm'
import { Container } from '../../../entities'

export const deleteContainer = {
  async deleteContainer(_, { id }) {
    const repository = getRepository(Container)

    return await repository.delete(id)
  }
}

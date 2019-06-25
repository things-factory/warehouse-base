import { getRepository } from 'typeorm'
import { Container } from '../../../entities'

export const updateContainer = {
  async updateContainer(_, { id, patch }) {
    const repository = getRepository(Container)

    const container = await repository.findOne({ id })

    return await repository.save({
      ...container,
      ...patch
    })
  }
}

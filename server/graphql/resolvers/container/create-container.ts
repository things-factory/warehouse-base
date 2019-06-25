import uuid from 'uuid/v4'

import { getRepository } from 'typeorm'
import { Container } from '../../../entities'

export const createContainer = {
  async createContainer(_, { container: attrs }) {
    const repository = getRepository(Container)
    const newContainer = {
      id: uuid(),
      ...attrs
    }

    return await repository.save(newContainer)
  }
}

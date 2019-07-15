import { getRepository } from 'typeorm'
import { Movement } from '../../../entities'

export const createMovement = {
  async createMovement(_: any, { movement }, context: any) {
    return await getRepository(Movement).save({
      domain: context.domain,
      creatorId: context.state.user.id,
      updaterId: context.state.user.id,
      ...movement
    })
  }
}

import { getRepository } from 'typeorm'
import { Movement } from '../../../entities'

export const createMovement = {
  async createMovement(_: any, { movement }, context: any) {
    return await getRepository(Movement).save({
      domain: context.domain,
      creator: context.state.user,
      updater: context.state.user,
      ...movement
    })
  }
}

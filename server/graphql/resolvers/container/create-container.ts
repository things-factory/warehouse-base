import { getRepository } from 'typeorm'
import { Container } from '../../../entities'

export const createContainer = {
  async createContainer(_: any, { container }, context: any) {
    return await getRepository(Container).save({
      domain: context.domain,
      creatorId: context.state.user.id,
      updaterId: context.state.user.id,
      ...container
    })
  }
}

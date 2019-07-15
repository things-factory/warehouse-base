import { getRepository } from 'typeorm'
import { Location } from '../../../entities'

export const createLocation = {
  async createLocation(_: any, { location }, context: any) {
    return await getRepository(Location).save({
      domain: context.domain,
      creatorId: context.state.user.id,
      updaterId: context.state.user.id,
      ...location
    })
  }
}

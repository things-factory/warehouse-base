import { getRepository } from 'typeorm'
import { Location } from '../../../entities'

export const updateLocation = {
  async updateLocation(_: any, { name, patch }, context: any) {
    const repository = getRepository(Location)
    const location = await repository.findOne({ where: { domain: context.domain, name } })

    return await repository.save({
      ...location,
      ...patch,
      updaterId: context.state.user.id
    })
  }
}

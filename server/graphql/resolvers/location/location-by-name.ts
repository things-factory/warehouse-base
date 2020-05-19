import { getRepository } from 'typeorm'
import { Location } from '../../../entities'

export const locationByNameResolver = {
  async locationByName(_: any, { name }, context: any) {
    return await getRepository(Location).findOne({
      where: {
        domain: context.state.domain,
        name
      },
      relations: ['domain', 'warehouse', 'creator', 'updater']
    })
  }
}

import { getRepository } from 'typeorm'
import { Location } from '../../../entities'

export const locationResolver = {
  async location(_: any, { name }, context: any) {
    return await getRepository(Location).findOne({
      where: { domain: context.domain, name },
      relations: ['domain', 'creator', 'updater']
    })
  }
}

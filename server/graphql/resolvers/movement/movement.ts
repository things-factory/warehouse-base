import { getRepository } from 'typeorm'
import { Movement } from '../../../entities'

export const movementResolver = {
  async movement(_: any, { id }, context: any) {
    return await getRepository(Movement).findOne({
      where: { domain: context.domain, id },
      relations: ['domain', 'creator', 'updater']
    })
  }
}

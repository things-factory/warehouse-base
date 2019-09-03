import { getRepository } from 'typeorm'
import { Movement } from '../../../entities'

export const movementResolver = {
  async movement(_: any, { id }, context: any) {
    return await getRepository(Movement).findOne({
      where: { domain: context.state.domain, id },
      relations: ['domain', 'warehouse', 'product', 'creator', 'updater']
    })
  }
}

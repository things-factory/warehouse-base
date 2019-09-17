import { Bizplace } from '@things-factory/biz-base'
import { getRepository, In } from 'typeorm'
import { Movement } from '../../../entities'

export const movementResolver = {
  async movement(_: any, { name }, context: any) {
    return await getRepository(Movement).findOne({
      where: {
        domain: context.state.domain,
        name,
        bizplace: In(context.state.bizplaces.map((bizplace: Bizplace) => bizplace.id))
      },
      relations: ['domain', 'bizplace', 'inventory', 'creator', 'updater']
    })
  }
}

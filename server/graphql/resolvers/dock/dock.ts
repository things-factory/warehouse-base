import { getRepository } from 'typeorm'
import { Dock } from '../../../entities'

export const dockResolver = {
  async dock(_: any, { name }, context: any) {
    return await getRepository(Dock).findOne({
      where: { domain: context.state.domain, name },
      relations: ['domain', 'creator', 'updater']
    })
  }
}

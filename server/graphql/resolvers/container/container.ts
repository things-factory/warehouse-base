import { getRepository } from 'typeorm'
import { Container } from '../../../entities'

export const containerResolver = {
  async container(_: any, { name }, context: any) {
    return await getRepository(Container).findOne({
      where: { domain: context.state.domain, name },
      relations: ['domain', 'creator', 'updater']
    })
  }
}

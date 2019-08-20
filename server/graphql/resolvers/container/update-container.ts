import { getRepository } from 'typeorm'
import { Container } from '../../../entities'

export const updateContainer = {
  async updateContainer(_: any, { name, patch }, context: any) {
    const repository = getRepository(Container)
    const container = await repository.findOne({ where: { domain: context.domain, name } })
    return await repository.save({
      ...container,
      ...patch,
      updater: context.state.user
    })
  }
}

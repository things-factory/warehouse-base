import { getRepository } from 'typeorm'
import { Movement } from '../../../entities'

export const updateMovement = {
  async updateMovement(_: any, { id, patch }, context: any) {
    const repository = getRepository(Movement)

    const movement = await repository.findOne({ where: { domain: context.state.domain, id } })

    return await repository.save({
      ...movement,
      ...patch,
      updater: context.state.user
    })
  }
}

import { getRepository } from 'typeorm'
import { Movement } from '../../../entities'

export const updateMovement = {
  async updateMovement(_: any, { id, patch }, context: any) {
    const repository = getRepository(Movement)

    const movement = await repository.findOne({ where: { domain: context.domain, id } })

    return await repository.save({
      ...movement,
      ...patch,
      updaterId: context.state.user.id
    })
  }
}

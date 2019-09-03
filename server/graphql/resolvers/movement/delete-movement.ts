import { getRepository } from 'typeorm'
import { Movement } from '../../../entities'

export const deleteMovement = {
  async deleteMovement(_: any, { id }, context: any) {
    return await getRepository(Movement).delete({ domain: context.state.domain, id })
  }
}

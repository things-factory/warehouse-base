import { getRepository } from 'typeorm'
import { Movement } from '../../../entities'

export const deleteMovement = {
  async deleteMovement(_: any, { name }) {
    await getRepository(Movement).delete(name)
    return true
  }
}

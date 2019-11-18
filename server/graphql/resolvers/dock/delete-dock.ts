import { getRepository } from 'typeorm'
import { Dock } from '../../../entities'

export const deleteDock = {
  async deleteDock(_: any, { name }, context: any) {
    await getRepository(Dock).delete({ domain: context.state.domain, name })
    return true
  }
}


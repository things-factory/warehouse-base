import { getRepository } from 'typeorm'
import { Dock } from '../../../entities'

export const createDock = {
  async createDock(_: any, { dock }, context: any) {
    return await getRepository(Dock).save({
      ...dock,
      domain: context.state.domain,
      creator: context.state.user,
      updater: context.state.user
    })
  }
}

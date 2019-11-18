import { getRepository } from 'typeorm'
import { Dock } from '../../../entities'

export const updateDock = {
  async updateDock(_: any, { name, patch }, context: any) {
    const repository = getRepository(Dock)
    const dock = await repository.findOne({ 
      where: { domain: context.state.domain, name }
    })

    return await repository.save({
      ...dock,
      ...patch,
      updater: context.state.user
    })
  }
}
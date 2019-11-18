import { getRepository } from 'typeorm'
import { Dock, Warehouse } from '../../../entities'

export const createDock = {
  async createDock(_: any, { dock }, context: any) {
    if (dock.warehouse && dock.warehouse.id) {
      dock.warehouse = await getRepository(Warehouse).findOne(dock.warehouse.id)
    }

    return await getRepository(Dock).save({
      ...dock,
      domain: context.state.domain,
      creator: context.state.user,
      updater: context.state.user
    })
  }
}

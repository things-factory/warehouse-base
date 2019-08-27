import { getRepository } from 'typeorm'
import { Location, Warehouse } from '../../../entities'

export const createLocation = {
  async createLocation(_: any, { location }, context: any) {
    if (location.warehouse && location.warehouse.id) {
      location.warehouse = await getRepository(Warehouse).findOne(location.warehouse.id)
    }

    return await getRepository(Location).save({
      ...location,
      domain: context.domain,
      creator: context.state.user,
      updater: context.state.user
    })
  }
}

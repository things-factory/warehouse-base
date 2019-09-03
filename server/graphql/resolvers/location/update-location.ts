import { getRepository } from 'typeorm'
import { Location, Warehouse } from '../../../entities'

export const updateLocation = {
  async updateLocation(_: any, { name, patch }, context: any) {
    const location = await getRepository(Location).findOne({ domain: context.state.domain, name })

    if (patch.warehouse && patch.warehouse.id) {
      patch.warehouse = await getRepository(Warehouse).findOne(patch.warehouse.id)
    }

    return await getRepository(Location).save({
      ...location,
      ...patch,
      updater: context.state.user
    })
  }
}

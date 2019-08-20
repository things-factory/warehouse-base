import { getRepository } from 'typeorm'
import { Location, Warehouse } from '../../../entities'

export const createLocation = {
  async createLocation(_: any, { location }, context: any) {
    return await getRepository(Location).save({
      domain: context.domain,
      warehouse: await getRepository(Warehouse).findOne({ where: { name: location.warehouse } }),
      creator: context.state.user,
      updater: context.state.user,
      ...location
    })
  }
}

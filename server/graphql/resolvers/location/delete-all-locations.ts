import { getRepository } from 'typeorm'
import { Location, Warehouse } from '../../../entities'

export const deleteAllLocations = {
  async deleteAllLocations(_: any, { name }, context: any) {
    await getRepository(Location).delete({
      warehouse: await getRepository(Warehouse).findOne({
        domain: context.state.domain,
        name
      })
    })

    return true
  }
}

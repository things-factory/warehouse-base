import { getRepository, In } from 'typeorm'
import { Location } from '../../../entities'

export const deleteLocations = {
  async deleteLocations(_: any, { names }) {
    await getRepository(Location).delete({
      name: In(names)
    })

    return true
  }
}

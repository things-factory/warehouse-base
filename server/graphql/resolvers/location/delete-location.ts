import { getRepository } from 'typeorm'
import { Location } from '../../../entities'

export const deleteLocation = {
  async deleteLocation(_: any, { name }, context: any) {
    return await getRepository(Location).delete({ domain: context.domain, name })
  }
}

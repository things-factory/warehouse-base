import { getRepository } from 'typeorm'
import { Pallet } from '../../../entities'

export const deletePallet = {
  async deletePallet(_: any, { name }, context: any) {
    await getRepository(Pallet).delete({ domain: context.state.domain, name })
    return true
  }
}


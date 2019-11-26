import { getRepository, In } from 'typeorm'
import { Pallet } from '../../../entities'

export const deletePallets = {
  async deletePallets(_: any, { names }, context: any) {
    await getRepository(Pallet).delete({ 
        domain: context.state.domain,
        name: In(names)
    })
    return true
  }
}


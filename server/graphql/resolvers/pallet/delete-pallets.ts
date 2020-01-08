import { getRepository, In } from 'typeorm'
import { Pallet } from '../../../entities'

export const deletePallets = {
  async deletePallets(_: any, { id }, context: any) {
    await getRepository(Pallet).delete({
      domain: context.state.domain,
      id: In(id)
    })
    return true
  }
}

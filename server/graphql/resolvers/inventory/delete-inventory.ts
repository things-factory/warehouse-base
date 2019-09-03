import { getRepository } from 'typeorm'
import { Inventory } from '../../../entities'

export const deleteInventory = {
  async deleteInventory(_: any, { name }, context: any) {
    return await getRepository(Inventory).delete({ domain: context.state.domain, name })
  }
}

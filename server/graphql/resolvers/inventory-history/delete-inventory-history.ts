import { getRepository } from 'typeorm'
import { InventoryHistory } from '../../../entities'

export const deleteInventoryHistory = {
  async deleteInventoryHistory(_: any, { name }, context: any) {
    await getRepository(InventoryHistory).delete({ domain: context.state.domain, name })
    return true
  }
}

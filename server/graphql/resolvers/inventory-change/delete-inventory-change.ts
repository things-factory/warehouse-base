import { getRepository } from 'typeorm'
import { InventoryChange } from '../../../entities'

export const deleteInventoryChange = {
  async deleteInventoryChange(_: any, { name }, context: any) {
    await getRepository(InventoryChange).delete({ domain: context.state.domain, name })
    return true
  }
}


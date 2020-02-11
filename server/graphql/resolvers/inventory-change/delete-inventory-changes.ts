import { getRepository, In } from 'typeorm'
import { InventoryChange } from '../../../entities'

export const deleteInventoryChanges = {
  async deleteInventoryChanges(_: any, { names }, context: any) {
    await getRepository(InventoryChange).delete({ 
        domain: context.state.domain,
        name: In(names)
    })
    return true
  }
}


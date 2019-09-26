import { getRepository, In } from 'typeorm'
import { InventoryHistory } from '../../../entities'

export const deleteInventoryHistories = {
  async deleteInventoryHistories(_: any, { names }, context: any) {
    await getRepository(InventoryHistory).delete({
      domain: context.state.domain,
      name: In(names)
    })
    return true
  }
}

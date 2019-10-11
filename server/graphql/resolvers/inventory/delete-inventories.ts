import { getRepository, In } from 'typeorm'
import { Inventory } from '../../../entities'

export const deleteInventories = {
  async deleteInventories(_: any, { id }) {
    await getRepository(Inventory).delete({
      id: In(id)
    })

    return true
  }
}

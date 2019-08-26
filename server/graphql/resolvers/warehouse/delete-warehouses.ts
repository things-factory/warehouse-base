import { getRepository, In } from 'typeorm'
import { Warehouse } from '../../../entities'

export const deleteWarehouses = {
  async deleteWarehouses(_: any, { names }) {
    await getRepository(Warehouse).delete({
      name: In(names)
    })

    return true
  }
}

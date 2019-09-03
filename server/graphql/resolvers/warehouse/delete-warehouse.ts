import { getRepository } from 'typeorm'
import { Warehouse } from '../../../entities'

export const deleteWarehouse = {
  async deleteWarehouse(_: any, { name }, context: any) {
    await getRepository(Warehouse).delete({ domain: context.state.domain, name })
    return true
  }
}

import { getRepository } from 'typeorm'
import { Warehouse } from '../../../entities'

export const deleteWarehouse = {
  async deleteWarehouse(_: any, { name }, context: any) {
    return await getRepository(Warehouse).delete({ domain: context.domain, name })
  }
}

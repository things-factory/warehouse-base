import { getRepository } from 'typeorm'
import { Inventory } from '../../../entities'

export const inventoryResolver = {
  async inventory(_: any, { name }, context: any) {
    return await getRepository(Inventory).findOne({
      where: { domain: context.domain, name },
      relations: ['domain', 'product', 'location', 'productBatch', 'creator', 'updater']
    })
  }
}

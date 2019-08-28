import { getRepository } from 'typeorm'
import { Warehouse } from '../../../entities'

export const warehouseResolver = {
  async warehouse(_: any, { name }, context: any) {
    return await getRepository(Warehouse).findOne({
      where: { domain: context.domain, name, bizplace: context.bizplace },
      relations: ['domain', 'bizplace', 'locations', 'creator', 'updater']
    })
  }
}

import { getRepository } from 'typeorm'
import { Inventory } from '../../../entities'
import { buildQuery, ListParam } from '@things-factory/shell'

export const inventoriesResolver = {
  async inventories(_: any, params: ListParam) {
    const queryBuilder = getRepository(Inventory).createQueryBuilder()
    buildQuery(queryBuilder, params)
    const [items, total] = await queryBuilder
      .leftJoinAndSelect('Inventory.domain', 'Domain')
      .leftJoinAndSelect('Inventory.creator', 'Creator')
      .leftJoinAndSelect('Inventory.updater', 'Updater')
      .getManyAndCount()

    return { items, total }
  }
}

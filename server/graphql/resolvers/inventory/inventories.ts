import { getRepository } from 'typeorm'
import { Inventory } from '../../../entities'
import { buildQuery, ListParam } from '@things-factory/shell'

export const inventoriesResolver = {
  async inventories(_: any, params: ListParam, context: any) {
    const queryBuilder = getRepository(Inventory).createQueryBuilder()
    buildQuery(queryBuilder, params, context)
    const [items, total] = await queryBuilder
      .leftJoinAndSelect('Inventory.domain', 'Domain')
      .leftJoinAndSelect('Inventory.product', 'Product')
      .leftJoinAndSelect('Inventory.location', 'Location')
      .leftJoinAndSelect('Inventory.productBatch', 'ProductBatch')
      .leftJoinAndSelect('Inventory.creator', 'Creator')
      .leftJoinAndSelect('Inventory.updater', 'Updater')
      .getManyAndCount()

    return { items, total }
  }
}

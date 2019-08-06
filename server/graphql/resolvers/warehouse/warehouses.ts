import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Warehouse } from '../../../entities'

export const warehousesResolver = {
  async warehouses(_: any, params: ListParam, context: any) {
    const queryBuilder = getRepository(Warehouse).createQueryBuilder()
    buildQuery(queryBuilder, params, context)
    const [items, total] = await queryBuilder
      .leftJoinAndSelect('Warehouse.domain', 'Domain')
      .leftJoinAndSelect('Warehouse.bizplace', 'Bizplace')
      .leftJoinAndSelect('Warehouse.locations', 'Locations')
      .leftJoinAndSelect('Warehouse.creator', 'Creator')
      .leftJoinAndSelect('Warehouse.updater', 'Updater')
      .getManyAndCount()

    return { items, total }
  }
}

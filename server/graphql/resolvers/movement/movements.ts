import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Movement } from '../../../entities'

export const movementsResolver = {
  async movements(_: any, params: ListParam, context: any) {
    const queryBuilder = getRepository(Movement).createQueryBuilder()
    buildQuery(queryBuilder, params, context)
    const [items, total] = await queryBuilder
      .leftJoinAndSelect('Movement.domain', 'Domain')
      .leftJoinAndSelect('Movement.warehouse', 'Warehouse')
      .leftJoinAndSelect('Movement.product', 'Product')
      .leftJoinAndSelect('Movement.creator', 'Creator')
      .leftJoinAndSelect('Movement.updater', 'Updater')
      .getManyAndCount()

    return { items, total }
  }
}

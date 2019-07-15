import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Movement } from '../../../entities'

export const movementsResolver = {
  async movements(_: any, params: ListParam) {
    const queryBuilder = getRepository(Movement).createQueryBuilder()
    buildQuery(queryBuilder, params)
    const [items, total] = await queryBuilder
      .leftJoinAndSelect('Movement.domain', 'Domain')
      .leftJoinAndSelect('Movement.creator', 'Creator')
      .leftJoinAndSelect('Movement.updater', 'Updater')
      .getManyAndCount()

    return { items, total }
  }
}

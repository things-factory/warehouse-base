import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Container } from '../../../entities'

export const containersResolver = {
  async containers(_: any, params: ListParam, context: any) {
    const queryBuilder = getRepository(Container).createQueryBuilder()
    buildQuery(queryBuilder, params)
    const [items, total] = await queryBuilder.getManyAndCount()

    return { items, total }
  }
}
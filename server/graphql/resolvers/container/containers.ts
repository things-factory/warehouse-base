import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Container } from '../../../entities'

export const containersResolver = {
  async containers(_: any, params: ListParam) {
    const queryBuilder = getRepository(Container).createQueryBuilder()
    buildQuery(queryBuilder, params)
    const [items, total] = await queryBuilder
      .leftJoinAndSelect('Container.domain', 'Domain')
      .leftJoinAndSelect('Container.creator', 'Creator')
      .leftJoinAndSelect('Container.updater', 'Updater')
      .getManyAndCount()

    return { items, total }
  }
}

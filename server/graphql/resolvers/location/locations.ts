import { getRepository } from 'typeorm'
import { buildQuery, ListParam } from '@things-factory/shell'
import { Location } from '../../../entities'

export const locationsResolver = {
  async locations(_: any, params: ListParam) {
    const queryBuilder = getRepository(Location).createQueryBuilder()
    buildQuery(queryBuilder, params)
    const [items, total] = await queryBuilder
      .leftJoinAndSelect('Location.domain', 'Domain')
      .leftJoinAndSelect('Location.warehouse', 'Warehouse')
      .leftJoinAndSelect('Location.creator', 'Creator')
      .leftJoinAndSelect('Location.updater', 'Updater')
      .getManyAndCount()

    return { items, total }
  }
}

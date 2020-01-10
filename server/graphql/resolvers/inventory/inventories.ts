import { getPermittedBizplaceIds, Bizplace } from '@things-factory/biz-base'
import { convertListParams, ListParam, buildQuery } from '@things-factory/shell'
import { getRepository, SelectQueryBuilder } from 'typeorm'
import { Inventory } from '../../../entities'

export const inventoriesResolver = {
  async inventories(_: any, params: ListParam, context: any) {
    if (!params.filters.find((filter: any) => filter.name === 'bizplace')) {
      params.filters.push({
        name: 'bizplace',
        operator: 'in',
        value: await getPermittedBizplaceIds(context.state.domain, context.state.user)
      })
    }

    const arrChildSortData = ['bizplace', 'product', 'location', 'warehouse', 'zone']
    const convertedParams = convertListParams(params)
    const orderParams = params.sortings.reduce(
      (acc, sort) => ({
        ...acc,
        [arrChildSortData.indexOf(sort.name) >= 0 ? sort.name + '.name' : 'iv.' + sort.name]: sort.desc ? 'DESC' : 'ASC'
      }),
      {}
    )

    const arrChildFilterData = ['bizplace.name', 'product.name', 'location.name', 'warehouse.name', 'zone.name']
    const qb: SelectQueryBuilder<Inventory> = getRepository(Inventory).createQueryBuilder('iv')

    qb.leftJoinAndSelect('iv.domain', 'domain')
      .leftJoinAndSelect('iv.bizplace', 'bizplace')
      .leftJoinAndSelect('iv.product', 'product')
      .leftJoinAndSelect('iv.warehouse', 'warehouse')
      .leftJoinAndSelect('iv.location', 'location')
      .leftJoinAndSelect('iv.creator', 'creator')
      .leftJoinAndSelect('iv.updater', 'updater')
      .where('1=1')

    params.filters.forEach(item => {
      let columnName = arrChildFilterData.indexOf(item.name) >= 0 ? item.name : 'iv.' + item.name
      switch (item.operator) {
        case 'in':
          qb.andWhere(columnName + ' IN (:...' + item.name + ')', { [item.name]: item.value })
          break
        case 'notin':
          qb.andWhere(columnName + ' NOT IN (:...' + item.name + ')', { [item.name]: item.value })
          break
        case 'eq':
          qb.andWhere(columnName + ' = :' + item.name + '', { [item.name]: item.value })
          break
        case 'i_like':
          qb.andWhere('LOWER(' + columnName + ')' + ' LIKE :' + item.name + '', {
            [item.name]: item.value.toLowerCase()
          })
          break
        default:
          break
      }
    })

    let [items, total] = await qb
      .skip(convertedParams.skip)
      .take(convertedParams.take)
      .orderBy(orderParams)
      .getManyAndCount()

    items = items.map((item: Inventory) => {
      const remainQty: number = item.qty && item.lockedQty ? item.qty - item.lockedQty : item.qty || 0
      const remainWeight: number = item.weight && item.lockedWeight ? item.weight - item.lockedWeight : item.weight || 0

      return {
        ...item,
        remainQty,
        remainWeight
      }
    })

    return { items, total }
  }
}

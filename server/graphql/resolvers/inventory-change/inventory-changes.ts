import { getPermittedBizplaceIds, Bizplace } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'
import { convertListParams, ListParam, buildQuery } from '@things-factory/shell'
import { getRepository, SelectQueryBuilder, Brackets } from 'typeorm'
import { InventoryChange, Location, Warehouse } from '../../../entities'

export const inventoryChangesResolver = {
  async inventoryChanges(_: any, params: ListParam, context: any) {
    let bizplaces:Bizplace[]
    if (!params.filters.find(filter=>filter.name ==='bizplace')) {
      bizplaces = await getPermittedBizplaceIds(context.state.domain, context.state.user)
    }else{
      bizplaces = [params.filters.find(filter=>filter.name ==='bizplace').value]
      params.filters = [...params.filters.filter(filter=>filter.name !='bizplace')]
    }

    const qb: SelectQueryBuilder<InventoryChange> = getRepository(InventoryChange).createQueryBuilder('ic')
    buildQuery(qb, params, context)

    qb.innerJoinAndSelect('ic.domain', 'dm')
      .leftJoinAndSelect('ic.bizplace', 'biz')
      .leftJoinAndSelect('ic.inventory', 'iv')
      .leftJoinAndSelect('iv.bizplace', 'ivBiz')
      .leftJoinAndSelect('iv.product', 'ivPrd')
      .leftJoinAndSelect('iv.location', 'ivLoc')
      .leftJoinAndSelect('ic.product', 'product')
      .leftJoinAndSelect('ic.location', 'location')
      .leftJoinAndSelect('ic.lastInventoryHistory', 'livh')
      .leftJoinAndSelect('livh.bizplace', 'livhBiz')
      .innerJoinAndSelect('ic.creator', 'creator')
      .innerJoinAndSelect('ic.updater', 'updater')
      .orderBy('ic.createdAt', "DESC" )
    
    qb.andWhere(
        new Brackets(qb => {
          qb.where('"iv"."bizplace_id" IN (:...bizplaces)',)
          qb.orWhere('"ic"."bizplace_id" IN (:...bizplaces)')
        })
      )

    qb
    .setParameters({
      bizplaces: bizplaces
    })

    let [items, total] = await qb.getManyAndCount()

    items = await Promise.all(
      items.map(async item => {
        if (item.lastInventoryHistory != null) {
          item.lastInventoryHistory = {
            ...item.lastInventoryHistory,
            product: await getRepository(Product).findOne(item.lastInventoryHistory.productId),
            warehouse: await getRepository(Warehouse).findOne(item.lastInventoryHistory.warehouseId),
            location: await getRepository(Location).findOne(item.lastInventoryHistory.locationId)
          } as any
        }
        return item
      })
    )

    return { items, total }
  }
}

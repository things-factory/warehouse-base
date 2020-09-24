import { ListParam } from '@things-factory/shell'
import { getPermittedBizplaceIds } from '@things-factory/biz-base'
import { getRepository } from 'typeorm'
import { Inventory } from '../../../entities'

export const onhandInventoryCountResolver = {
  async onhandInventoryCount(_: any, params: ListParam, context: any) {
    let bizplaces = await getPermittedBizplaceIds(context.state.domain, context.state.user)
    bizplaces = bizplaces.map(bizplace => {
                  return "'" + bizplace.trim() + "'"
                }).join(',')

    let result = await getRepository(Inventory).query(`
        select sum(qty) as total from (
            select count(pallet_id) as qty from inventories i2
            where status not in ('INTRANSIT', 'TERMINATED', 'DELETED')
            and reusable_pallet_id is null
            and bizplace_id in (${bizplaces})
            and domain_id = '${context.state.domain.id}'
            union all
            select count(distinct reusable_pallet_id) as qty from inventories i2
            where status not in ('INTRANSIT', 'TERMINATED', 'DELETED')
            and reusable_pallet_id notnull
            and bizplace_id in (${bizplaces})
            and domain_id = '${context.state.domain.id}'
        ) as foo
    `
    )
    
    const items = []
    const total = parseInt(result[0].total)

    return { items, total }
  }
}

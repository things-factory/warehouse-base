import { getRepository, Between, In } from 'typeorm'
import { getPermittedBizplaceIds } from '@things-factory/biz-base'
import { InventoryHistory } from '../../../entities'

export const outboundMovementsCounterResolver = {
  async outboundMovementsCounter(_: any, { month, year }, context: any) {
    let bizplaces = await getPermittedBizplaceIds(context.state.domain, context.state.user)
    bizplaces = bizplaces.map(bizplace => {
                  return "'" + bizplace.trim() + "'"
                }).join(',')
    
    let startDate = new Date()
    let endDate = new Date()
    startDate.setDate(startDate.getDate()-30)
    startDate.setHours(0)
    startDate.setMinutes(0)
    startDate.setSeconds(0)
    const timeNow = `${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}`
    
    const counter = await getRepository(InventoryHistory).query(`
      select outbound_date, count(*) from(
        select date(ih.created_at) outbound_date, row_number() over(partition by ih.pallet_id order by ih.created_at desc) as rn, ih.*, iv.bizplace_id
        from inventory_histories ih
        inner join inventories iv on iv.pallet_id = ih.pallet_id and iv.domain_id = ih.domain_id
        where ih.domain_id='${context.state.domain.id}'
        and iv.bizplace_id in (${bizplaces}) and ih.status = 'TERMINATED'
      ) as src 
      where rn = 1
      and created_at between '${startDate.toLocaleDateString()} 00:00:00' and '${endDate.toLocaleDateString()} ${timeNow}'
      group by src.outbound_date
      order by src.outbound_date
    `)

    let items = []
    for (let i=0; i<30; i++) {
      items.push({
        date: `${startDate.getDate()}/${startDate.getMonth()+1}`,
        count: '0'
      })
      startDate.setDate(startDate.getDate()+1)
    }

    let compareDate = new Date()
    compareDate.setDate(compareDate.getDate()-30)
    compareDate.setHours(0)
    compareDate.setMinutes(0)
    compareDate.setSeconds(0)

    items = items.map(item => {
      for (let x=0; x<counter.length; x++) {
        if (counter[x].outbound_date.toLocaleDateString() === compareDate.toLocaleDateString()) {
          item.count = counter[x].count
        }
      }
      compareDate.setDate(compareDate.getDate()+1)
      return item
    })

    return items
  }
}
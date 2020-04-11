import { getRepository, Between } from 'typeorm'
import { convertListParams, ListParam } from '@things-factory/shell'
import { getPermittedBizplaceIds } from '@things-factory/biz-base'
import { Bizplace, BizplaceUser } from '@things-factory/biz-base'
import { InventoryHistory } from '../../../entities'

export const inboundMovementsCounterResolver = {
  async inboundMovementsCounter(_: any, params: ListParam, context: any) {
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
      select inbound_date, count(*) from(
        select date(ih.created_at) inbound_date from inventory_histories ih
        where ih.bizplace_id in (${bizplaces})
        and ih.transaction_type in ('NEW', 'PUTAWAY')
        and created_at between '${startDate.toLocaleDateString()} 00:00:00' and '${endDate.toLocaleDateString()} ${timeNow}'
        and domain_id = '${context.state.domain.id}'
      ) as foo
      group by inbound_date
      order by inbound_date asc
    `)

    let items = []
    for (let i=0; i<30; i++) {
      const month = startDate.toLocaleString('default', { month: 'short' })
      const day = startDate.getDate()

      items.push({
        date: `${month} ${day.toString().padStart(2,'0')}`,
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
        if (counter[x].inbound_date.toLocaleDateString() === compareDate.toLocaleDateString()) {
          item.count = counter[x].count
        }
      }
      compareDate.setDate(compareDate.getDate()+1)
      return item
    })

    return items
  }
}
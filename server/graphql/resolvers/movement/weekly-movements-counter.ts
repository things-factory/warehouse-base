import { getRepository, Between, In } from 'typeorm'
import { getPermittedBizplaceIds } from '@things-factory/biz-base'
import { InventoryHistory } from '../../../entities'

export const weeklyMovementsCounterResolver = {
  async weeklyMovementsCounter(_: any, { month, year }, context: any) {
    let bizplaces = await getPermittedBizplaceIds(context.state.domain, context.state.user)
    bizplaces = bizplaces.map(bizplace => {
			return "'" + bizplace.trim() + "'"
		}).join(',')
    
    if (!month && !year) {
		// if user didn't specify the month and year, set default as last month
			var firstOfMonth = new Date()
			var lastOfMonth = new Date()
			
			firstOfMonth.setMonth(firstOfMonth.getMonth()-1)
			firstOfMonth.setDate(1)
			lastOfMonth.setDate(0)
    } else {
			var firstOfMonth = new Date(year, month-1, 1)                
			var lastOfMonth = new Date(year, month, 0)
		}
		
		// get data from database
    const data = await getRepository(InventoryHistory).query(`
			select movement_date, sum(outbound_count) as outbound_count, sum(inbound_count) as inbound_count from (
				select movement_date, count(*) as outbound_count, 0 as inbound_count from(
					select date(ih.created_at) movement_date, row_number() over(partition by ih.pallet_id order by ih.created_at desc) as rn, ih.*, iv.bizplace_id
					from inventory_histories ih
					inner join inventories iv on iv.pallet_id = ih.pallet_id and iv.domain_id = ih.domain_id
					where ih.domain_id = '${context.state.domain.id}'
					and iv.bizplace_id in (${bizplaces}) and ih.status = 'TERMINATED'
				) as src 
				where rn = 1
				and created_at between '${firstOfMonth.toLocaleDateString()} 00:00:00' and '${lastOfMonth.toLocaleDateString()} 23:59:59'
				group by movement_date
				union all
				select movement_date, 0 as outbound_count, count(*) as inbound_count from(
						select date(ih.created_at) movement_date from inventory_histories ih
						where ih.bizplace_id in (${bizplaces})
						and ih.transaction_type in ('NEW', 'PUTAWAY')
						and created_at between '${firstOfMonth.toLocaleDateString()} 00:00:00' and '${lastOfMonth.toLocaleDateString()} 23:59:59'
					and domain_id = '${context.state.domain.id}'
				) as foo
				group by movement_date
				order by movement_date
			) src
			group by movement_date
		`)

		// pre-set the movements accordingly with initial value of in/outbound = 0
    let movements = [
			{ week: 1, inbound: 0, outbound: 0 },
			{ week: 2, inbound: 0, outbound: 0 },
			{ week: 3, inbound: 0, outbound: 0 },
			{ week: 4, inbound: 0, outbound: 0 }
		]
		
		// loop through all date that were retrieved from database
		for (let i=0; i<data.length; i++) {

			// asign data based on week number
			movements = movements.map(movement => {
				const compareDate = data[i].movement_date
				const inboundCount = parseInt(data[i].inbound_count)
				const outboundCount = parseInt(data[i].outbound_count)
				
				if (movement.week == 1 && compareDate.getDate() > 0 && compareDate.getDate() <= 7) {
					movement.inbound += inboundCount
					movement.outbound += outboundCount
				}
				else if (movement.week == 2 && compareDate.getDate() > 7 && compareDate.getDate() <= 14) {
					movement.inbound += inboundCount
					movement.outbound += outboundCount
				}
				else if (movement.week == 3 && compareDate.getDate() > 14 && compareDate.getDate() <= 21) {
					movement.inbound += inboundCount
					movement.outbound += outboundCount
				}
				else if (movement.week == 4 && compareDate.getDate() > 21) {
					movement.inbound += inboundCount
					movement.outbound += outboundCount
				}
				return movement
			})
		}

		// return total 4 weeks of in/outbound movements for a specific month
    return movements
  }
}
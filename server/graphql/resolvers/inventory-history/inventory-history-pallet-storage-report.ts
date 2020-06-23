import { ListParam } from '@things-factory/shell'
import { getManager, EntityManager, getRepository } from 'typeorm'
import { User } from '@things-factory/auth-base'
import { Bizplace, BizplaceUser } from '@things-factory/biz-base'
import { InventoryHistory } from '../../../entities'

export const inventoryHistoryPalletStorageReport = {
  async inventoryHistoryPalletStorageReport(_: any, params: ListParam, context: any) {
    try {
      let userFilter = params.filters.find(data => data.name === 'user')

      let bizplaceFilter = { name: '', operator: '', value: '' }

      if (userFilter) {
        const user: User = await getRepository(User).findOne({
          domain: context.state.domain,
          id: userFilter.value
        })

        const bizplaceUser: any = await getRepository(BizplaceUser).findOne({
          where: {
            user,
            domain: context.state.domain,
            mainBizplace: true
          },
          relations: ['bizplace']
        })

        if (!bizplaceUser.bizplace) throw 'Invalid input'

        bizplaceFilter = { name: 'bizplace', operator: 'eq', value: bizplaceUser.bizplace.id }
      } else {
        bizplaceFilter = params.filters.find(data => data.name === 'bizplace')
      }

      let fromDate = params.filters.find(data => data.name === 'fromDate')
      let toDate = params.filters.find(data => data.name === 'toDate')

      if (!bizplaceFilter || !fromDate || !toDate) throw 'Invalid input'

      const bizplace: Bizplace = await getRepository(Bizplace).findOne({
        id: bizplaceFilter.value
      })

      let queryFilter = ``
      let queryParams = []
      let locationType = params.filters.find(data => data.name === 'locationType')
      if (locationType) {
        queryFilter = queryFilter + `AND location_type = $` + (queryParams.length + 1)
        queryParams.push(locationType.value)
      }

      let zone = params.filters.find(data => data.name === 'zone')
      if (zone) {
        queryFilter = queryFilter + `AND location_zone ilike $` + (queryParams.length + 1)
        queryParams.push(zone.value)
      }

      return await getManager().transaction(async (trxMgr: EntityManager) => {
        await trxMgr.query(
          `
          create temp table temp_history as (
            select ih.* , inv.bizplace_id as bz_id from inventory_histories ih 
            inner join inventories inv on inv.pallet_id = ih.pallet_id and inv.domain_id = ih.domain_id 
            where ih.domain_id = $1
            and inv.bizplace_id = $2
            and not exists(
              select * from (
                SELECT DISTINCT ON (pallet_id) ih2.*
                FROM inventory_histories ih2
                where ih2.domain_id = $1
                and ih2.created_at < $3
                ORDER BY pallet_id , seq desc
              ) as foo where foo.status = 'TERMINATED' and foo.pallet_id = ih.pallet_id 
            )
            and ih.created_at <= $4
            order by ih.pallet_id , ih.seq 
          )      
        `,
          [context.state.domain.id, bizplace.id, fromDate.value, toDate.value]
        )

        await trxMgr.query(
          `          
          create temp table temp_pallet_storage_history as (
            with palletData as (
              select distinct on (inHistory.pallet_id) 
              inHistory.pallet_id, inHistory.created_at as in_at, loc.name as location_name, loc."type" as location_type, loc."zone"  as location_zone,
              bz.name as bizplace_name
              from temp_history inHistory
              inner join inventories inv on inv.pallet_id = inhistory.pallet_id  and inv.domain_id = inhistory.domain_id
              inner join locations loc on loc.id = inv.location_id
              inner join bizplaces bz on bz.id = inv.bizplace_id 
              order by inHistory.pallet_id, inHistory.seq
            )
            select * from (
              select bizplace_name, location_type, location_zone, location_name, string_agg(pallet_id, ', ') as pallet_id from palletData where location_type = 'SHELF' group by bizplace_name, location_name, location_type, location_zone
              union 
              select bizplace_name, location_type, location_zone, location_name, pallet_id from palletData where location_type = 'FLOOR'
            ) as src where 1 = 1
            ${queryFilter} 
          )
        `,
          queryParams
        )

        const total: any = await trxMgr.query(`select count(*) from temp_pallet_storage_history`)

        const result: any = await trxMgr.query(
          ` 
          select * from temp_pallet_storage_history OFFSET $1 LIMIT $2
        `,
          [(params.pagination.page - 1) * params.pagination.limit, params.pagination.limit]
        )

        trxMgr.query(`
          drop table temp_history, temp_pallet_storage_history
        `)

        let items = result.map(itm => {
          return {
            ...itm,
            bizplace: {
              name: itm.bizplace_name
            },
            location: {
              name: itm.location_name,
              type: itm.location_type,
              zone: itm.location_zone
            },
            palletId: itm.pallet_id
          }
        })

        return { items, total: total[0].count }
      })
    } catch (ex) {
      throw ex
    }
  }
}

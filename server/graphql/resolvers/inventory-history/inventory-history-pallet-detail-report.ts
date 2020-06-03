import { convertListParams, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { User } from '@things-factory/auth-base'
import { Bizplace, BizplaceUser } from '@things-factory/biz-base'
import { InventoryHistory } from '../../../entities'

export const inventoryHistoryPalletDetailReport = {
  async inventoryHistoryPalletDetailReport(_: any, params: ListParam, context: any) {
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
      let product = params.filters.find(data => data.name === 'product')

      if (!fromDate || !toDate) throw 'Invalid input'

      let bizplaceQuery = ''
      if (bizplaceFilter) {
        const bizplace: Bizplace = await getRepository(Bizplace).findOne({
          id: bizplaceFilter.value
        })

        if (bizplace) {
          bizplaceQuery = "AND i2.bizplace_id = '" + bizplace.id + "'"
        } else {
          throw 'Invalid input'
        }
      }

      let productQuery = ''
      if (product) {
        productQuery =
          'AND prd.name ILIKE ANY(ARRAY[' +
          product.value
            .split(',')
            .map(prod => {
              return "'%" + prod.trim().replace(/'/g, "''") + "%'"
            })
            .join(',') +
          '])'
      }

      const result = await getRepository(InventoryHistory).query(`
        with invHistory as (
          select case when ar.name is null then 'NEW' else ar.name end as arrival_notice_name, 
          case when js.container_size is null then '' else js.container_size end as container_size,
          i2.batch_id,
          bzp.name as bizplace_name,
          i2.pallet_id, ih.seq, ih.status, ih.transaction_type, i2.product_id, prd.name as product_name,
          prd.description as product_description,	ih.id as inventory_history_id, ih.packing_type, ih.qty, ih.opening_qty,
          ih.weight, ih.opening_weight, ih.created_at::date
          from inventories i2 
          inner join inventory_histories ih on ih.pallet_id = i2.pallet_id and ih.domain_id = i2.domain_id
          inner join products prd on prd.id = i2.product_id
          inner join bizplaces bzp on bzp.id = ih.bizplace_id
          left join order_inventories oi on oi.inventory_id = i2.id and oi.arrival_notice_id is not null
          left join arrival_notices ar on ar.id = oi.arrival_notice_id
          left join job_sheets js on js.id = ar.job_sheet_id
          where
            i2.domain_id = '${context.state.domain.id}'
            and (
            (ih.status = 'STORED' and ih.transaction_type = 'NEW') 
            or (ih.status = 'STORED' and ih.transaction_type = 'CANCEL_ORDER')
            or (ih.status = 'STORED' and ih.transaction_type = 'RETURN')
            or (ih.status = 'STORED' and ih.transaction_type = 'PUTAWAY') 
            or (ih.status = 'TERMINATED')
            ) 
            ${bizplaceQuery}
            ${productQuery}
          order by ih.pallet_id, ih.seq
        ), inventoryHistoryMovement as (
          select bizplace_name, container_size, pallet_id, seq, status, transaction_type, product_id, product_name, product_description, batch_id,
            inventory_history_id, packing_type, qty, opening_qty, weight, opening_weight, created_at, arrival_notice_name from (
              select row_number() over(partition by pallet_id order by created_at asc) as rn, *  from invHistory where status = 'STORED'
            )as invIn where rn = 1
            union all
            select bizplace_name, container_size, pallet_id, seq, status, transaction_type, product_id, product_name, product_description, batch_id,
            inventory_history_id, packing_type, qty, opening_qty, weight, opening_weight, created_at, arrival_notice_name from (
              select row_number() over(partition by pallet_id order by created_at desc) as rn, *  from invHistory
            )as invOut where rn = 1 and status = 'TERMINATED'
        ), inventoryHistoriesByPallet as (
          select invHistory.bizplace_name, invHistory.container_size, invHistory.product_name, invHistory.product_description, invHistory.arrival_notice_name, invHistory.batch_id,
          SUM(case when invHistory.created_at <= '${new Date(fromDate.value).toLocaleDateString()} 00:00:00' then 
              case when invHistory.status = 'STORED' then 1 else -1 end
              else 0 end) as opening_balance,
          SUM(case when invHistory.created_at >= '${new Date(fromDate.value).toLocaleDateString()} 00:00:00' 
              and invHistory.created_at <= '${new Date(toDate.value).toLocaleDateString()} 23:59:59' then 
              case when invHistory.status = 'STORED' then 1 else 0 end
              else 0 end) as in_balance,
          SUM(case when invHistory.created_at >= '${new Date(fromDate.value).toLocaleDateString()} 00:00:00' 
              and invHistory.created_at <= '${new Date(toDate.value).toLocaleDateString()} 23:59:59' then 
              case when invHistory.status = 'TERMINATED' then 1 else 0 end
              else 0 end) as out_balance
          from(
            select * from inventoryHistoryMovement
          ) as invHistory group by bizplace_name, container_size, product_name, product_description, arrival_notice_name, batch_id
        )
        select invh.*, invh.opening_balance + invh.in_balance - invh.out_balance as closing_balance 
        , (
          select json_agg(json_build_object('created_at', created_at, 'in_balance', in_balance, 'out_balance', out_balance)) as jsonData from 
            (
              select bizplace_name, product_name, batch_id, arrival_notice_name, created_at,
              SUM(case when status = 'STORED' then 1 else 0 end) as in_balance,
              SUM(case when status = 'TERMINATED' then 1 else 0 end) as out_balance
              from inventoryHistoryMovement
              where created_at >= '${new Date(fromDate.value).toLocaleDateString()} 00:00:00' and 
              created_at <= '${new Date(toDate.value).toLocaleDateString()} 23:59:59' and 
              bizplace_name = invh.bizplace_name and product_name = invh.product_name and
              batch_id = invh.batch_id and arrival_notice_name = invh.arrival_notice_name
              group by bizplace_name, product_name, batch_id, arrival_notice_name, created_at
              order by created_at
            ) 
          as t
        )::varchar as json_date_movement
        from inventoryHistoriesByPallet invh
        where invh.opening_balance >= 0
        and invh.in_balance >= 0
        and invh.out_balance >= 0
        and (invh.opening_balance > 0 or invh.in_balance > 0)
        order by invh.bizplace_name, invh.product_name, invh.batch_id;
      `)

      let items = result as any
      items = items.map(item => {
        return {
          bizplace: { name: item.bizplace_name },
          product: {
            name: item.product_name.trim() + ' ( ' + (item.product_description || '-').trim() + ' )'
          },
          arrivalNoticeName: item.arrival_notice_name,
          batchId: item.batch_id,
          openingBalance: item.opening_balance,
          inBalance: item.in_balance,
          outBalance: item.out_balance,
          closingBalance: item.closing_balance,
          jsonDateMovement: item.json_date_movement,
          containerSize: item.container_size
        }
      })

      return items
    } catch (error) {
      throw error
    }
  }
}

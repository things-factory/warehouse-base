import { convertListParams, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { User } from '@things-factory/auth-base'
import { Bizplace, BizplaceUser } from '@things-factory/biz-base'
import { InventoryHistory } from '../../../entities'

export const inventoryHistoryPalletReport = {
  async inventoryHistoryPalletReport(_: any, params: ListParam, context: any) {
    try {
      const convertedParams = convertListParams(params)
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

      if (!bizplaceFilter || !fromDate || !toDate) throw 'Invalid input'

      const bizplace: Bizplace = await getRepository(Bizplace).findOne({
        id: bizplaceFilter.value
      })

      let productQuery = ''
      if (product) {
        let productValue =
          product.value
            .toLowerCase()
            .split(',')
            .map(prod => {
              return "'%" + prod.trim().replace(/'/g, "''") + "%'"
            })
            .join(',') + ']) '
        productQuery =
          'AND prd.name ILIKE ANY(ARRAY[' +
          productValue +
          'OR prd.sku ILIKE ANY(ARRAY[' +
          productValue +
          'OR prd.description ILIKE ANY(ARRAY[' +
          productValue
      }

      const result = await getRepository(InventoryHistory).query(`
        with invHistory as (
          select i2.pallet_id, ih.seq, ih.status, ih.transaction_type, i2.product_id, prd.name as product_name,
          prd.description as product_description,	ih.id as inventory_history_id, ih.packing_type, ih.qty, ih.opening_qty,
          ih.weight, ih.opening_weight, ih.created_at
          from inventories i2 
          inner join reduced_inventory_histories ih on ih.pallet_id = i2.pallet_id and ih.domain_id = i2.domain_id
          inner join products prd on prd.id = i2.product_id
          where 
          i2.domain_id = '${context.state.domain.id}'
          AND i2.bizplace_id = '${bizplace.id}'
          and (
            (ih.status = 'STORED' and ih.transaction_type = 'NEW') 
            or (ih.status = 'STORED' and ih.transaction_type = 'CANCEL_ORDER')
            or (ih.status = 'STORED' and ih.transaction_type = 'RETURN')
            or (ih.status = 'STORED' and ih.transaction_type = 'PUTAWAY') 
            or (ih.status = 'TERMINATED' and ih.transaction_type = 'TERMINATED')
          )
          ${productQuery}
          order by ih.pallet_id, ih.seq
        ), inventoryHistoriesByPallet as (
          select invHistory.product_name, invHistory.product_description,
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
            select pallet_id, seq, status, transaction_type, product_id, product_name, product_description,
            inventory_history_id, packing_type, qty, opening_qty, weight, opening_weight, created_at from (
              select row_number() over(partition by pallet_id order by created_at asc) as rn, *  from invHistory where status = 'STORED'
            )as invIn where rn = 1
            union all
            select pallet_id, seq, status, transaction_type, product_id, product_name, product_description,
            inventory_history_id, packing_type, qty, opening_qty, weight, opening_weight, created_at from (
              select row_number() over(partition by pallet_id order by created_at desc) as rn, *  from invHistory
            )as invOut where rn = 1 and status = 'TERMINATED'
          ) as invHistory group by product_name, product_description
        )
        select invh.*, invh.opening_balance + invh.in_balance - invh.out_balance as closing_balance from inventoryHistoriesByPallet invh
        where invh.opening_balance >= 0
        and invh.in_balance >= 0
        and invh.out_balance >= 0
        and (invh.opening_balance > 0 or invh.in_balance > 0)
        order by invh.product_name;
      `)

      let items = result as any
      items = items.map(item => {
        return {
          bizplace: bizplace,
          product: {
            name: item.product_name.trim() + ' ( ' + item.product_description.trim() + ' )'
          },
          openingBalance: item.opening_balance,
          inBalance: item.in_balance,
          outBalance: item.out_balance,
          closingBalance: item.closing_balance
        }
      })

      return items
    } catch (error) {
      throw error
    }
  }
}

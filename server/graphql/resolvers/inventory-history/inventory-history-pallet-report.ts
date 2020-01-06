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
        productQuery =
          'AND prd.name ILIKE ANY(ARRAY[' +
          product.value
            .split(',')
            .map(prod => {
              return "'%" + prod.trim() + "%'"
            })
            .join(',') +
          '])'
      }

      const result = await getRepository(InventoryHistory).query(`
        ;with inventoryHistoriesByPallet as
        (
          select 
          invh.product_id, prd.name as product_name, prd.description as product_description, invh.bizplace_id,
          SUM(case when invh.created_at <= '${new Date(fromDate.value).toLocaleDateString()} 00:00:00' then 
              case when invh.status = 'STORED' then 1 else -1 end
            else 0 end) as opening_balance,
          SUM(case when invh.created_at >= '${new Date(
            fromDate.value
          ).toLocaleDateString()} 00:00:00' and invh.created_at <= '${new Date(
        toDate.value
      ).toLocaleDateString()} 23:59:59' then 
              case when invh.status = 'STORED' then 1 else 0 end
            else 0 end) as in_balance,
          SUM(case when invh.created_at >= '${new Date(
            fromDate.value
          ).toLocaleDateString()} 00:00:00' and invh.created_at <= '${new Date(
        toDate.value
      ).toLocaleDateString()} 23:59:59' then 
              case when invh.status = 'TERMINATED' then 1 else 0 end
            else 0 end) as out_balance
          from inventory_histories invh
          inner join (
            select pallet_id, product_id from (
              select pallet_id, product_id, row_number() over(partition by pallet_id order by created_at desc) as rn from inventory_histories
              where status = 'STORED'	
            ) as src where rn = 1
          ) filtered on filtered.pallet_id = invh.pallet_id and filtered.product_id = invh.product_id
          inner join products prd on cast(prd.id as VARCHAR) = invh.product_id
          where invh.status IN('STORED', 'TERMINATED')
          and invh.domain_id = '${context.state.domain.id}'
          AND invh.bizplace_id = '${bizplace.id}'
          ${productQuery}
          group by invh.product_id, invh.bizplace_id, prd.name, prd.description
        )
        select invh.*, invh.opening_balance + invh.in_balance - invh.out_balance as closing_balance from inventoryHistoriesByPallet invh
        where invh.opening_balance >= 0
        order by invh.product_name;
      `)

      let items = result as any
      items = items.map(item => {
        return {
          bizplace: bizplace,
          product: { name: item.product_name.trim() + ' ( ' + item.product_description.trim() + ' )' },
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

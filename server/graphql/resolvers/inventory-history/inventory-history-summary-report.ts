import { ListParam } from '@things-factory/shell'
import { getManager, EntityManager, getRepository } from 'typeorm'
import { User } from '@things-factory/auth-base'
import { Bizplace, BizplaceUser } from '@things-factory/biz-base'

export const inventoryHistorySummaryReport = {
  async inventoryHistorySummaryReport(_: any, params: ListParam, context: any) {
    try {
      let bizplaceFilter = { name: '', operator: '', value: '' }

      let userFilter = params.filters.find(data => data.name === 'user')
      let fromDate = params.filters.find(data => data.name === 'fromDate')
      let toDate = params.filters.find(data => data.name === 'toDate')
      let byPallet = params.filters.find(data => data.name === 'byPallet')

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

      if (!bizplaceFilter || !fromDate || !toDate) throw 'Invalid input'

      const bizplace: Bizplace = await getRepository(Bizplace).findOne({
        id: bizplaceFilter.value
      })

      return await getManager().transaction(async (trxMgr: EntityManager) => {
        let [result, total] = byPallet.value
          ? await massageInventoryPalletSummary(trxMgr, params, bizplace, context)
          : await massageInventorySummary(trxMgr, params, bizplace, context)

        let items = result.map(itm => {
          return {
            ...itm,
            batchId: itm.batch_id,
            packingType: itm.packing_type,
            openingQty: itm.opening_qty,
            adjustmentQty: itm.adjustment_qty,
            closingQty: itm.closing_qty,
            totalInQty: itm.total_in_qty,
            totalOutQty: itm.total_out_qty,
            product: {
              id: itm.product_id,
              name: itm.product_name + '( ' + itm.product_description + ' )',
              description: itm.product_description
            }
          }
        })

        return {
          items,
          total: total[0].count,
          totalInboundQty: total[0].totalinqty || 0,
          totalOpeningBal: total[0].totalopeningbal || 0
        }
      })
    } catch (error) {
      throw error
    }
  }
}

async function massageInventorySummary(trxMgr: EntityManager, params: ListParam, bizplace: Bizplace, context: any) {
  await productsQuery(trxMgr, params, bizplace)
  await filterInventoryQuery(trxMgr, params, bizplace, context)

  let fromDate = params.filters.find(data => data.name === 'fromDate')
  let hasTransactionOrBalanceFilter = params.filters.find(data => data.name === 'hasTransactionOrBalance')

  let hasTransactionOrBalanceQuery = ''
  if (hasTransactionOrBalanceFilter && hasTransactionOrBalanceFilter.value) {
    hasTransactionOrBalanceQuery = 'and (opening_qty > 0 or total_in_qty > 0)'
  }
  await trxMgr.query(
    `
    create temp table temp_inventory_summary as (
      select prd.name as product_name, prd.description as product_description , src.*,
      opening_qty + adjustment_qty + total_in_qty + total_out_qty as closing_qty
      from (
        select ih.packing_type,
        sum(case when ih.created_at >= $1 and ih.transaction_type = 'ADJUSTMENT' then ih.qty else 0 end) as adjustment_qty,
        sum(case when ih.created_at < $1 then qty else 0 end) as opening_qty,
        sum(case when ih.created_at >= $1 then case when ih.qty > 0 and ih.transaction_type <> 'ADJUSTMENT' then ih.qty else 0 end else 0 end) as total_in_qty,
        sum(case when ih.created_at >= $1 then case when ih.qty < 0 and ih.transaction_type <> 'ADJUSTMENT' then ih.qty else 0 end else 0 end) as total_out_qty,
        ih.product_id
        from temp_inv_history ih
        group by ih.product_id, ih.packing_type
      ) src
      inner join temp_products prd on prd.id = src.product_id
      where 1=1
      ${hasTransactionOrBalanceQuery}
    )
  `,
    [fromDate.value]
  )

  const total: any = await trxMgr.query(`select count(*) from temp_inventory_summary`)

  const result: any = await trxMgr.query(
    `
    select * from temp_inventory_summary ORDER BY product_name, product_description, packing_type OFFSET $1 LIMIT $2
  `,
    [(params.pagination.page - 1) * params.pagination.limit, params.pagination.limit]
  )

  trxMgr.query(`
    drop table temp_products, temp_inv_history, temp_inventory_summary
  `)

  return [result, total]
}

async function massageInventoryPalletSummary(
  trxMgr: EntityManager,
  params: ListParam,
  bizplace: Bizplace,
  context: any
) {
  await productsQuery(trxMgr, params, bizplace)
  await filterInventoryQuery(trxMgr, params, bizplace, context)

  let fromDate = params.filters.find(data => data.name === 'fromDate')
  let toDate = params.filters.find(data => data.name === 'toDate')
  let hasTransactionOrBalanceFilter = params.filters.find(data => data.name === 'hasTransactionOrBalance')

  let hasTransactionOrBalanceQuery = ''
  if (hasTransactionOrBalanceFilter && hasTransactionOrBalanceFilter.value) {
    hasTransactionOrBalanceQuery = 'and (opening_qty > 0 or total_in_qty > 0)'
  }
  await trxMgr.query(
    `
    create temp table temp_inventory_pallet_summary as (
      select invh.*,
      invh.opening_qty + invh.total_in_qty + invh.total_out_qty as closing_qty from (
        select product_id, product_name, product_description,
        SUM(case when invHistory.created_at < $1 then
          case when invHistory.status = 'STORED' then 1 
          when invhistory.status = 'TERMINATED' then -1
            else 0 end
            else 0 end) as opening_qty,
        SUM(case when invHistory.created_at >= $1 and invHistory.created_at <= $2 then 
          case when (invHistory.transaction_type = 'UNLOADING' or invHistory.transaction_type = 'NEW') then 1 else 0 end
            else 0 end) as total_in_qty,
        SUM(case when invHistory.created_at >= $1 and invHistory.created_at <= $2 then 
          case when invHistory.status = 'TERMINATED' then -1 else 0 end
            else 0 end) as total_out_qty,
        0 as adjustment_qty
        from(
        select pallet_id, seq, status, transaction_type, product_id, product_name, product_description,
        inventory_history_id, packing_type, qty, opening_qty, weight, opening_weight, created_at from (
          select row_number() over(partition by invh.pallet_id order by invh.created_at asc) as rn, invh.* ,
          prd.name as product_name, prd.description as product_description 
          from temp_inv_history invh
          inner join temp_products prd on prd.id = invh.product_id
          where (transaction_type = 'UNLOADING' or invh.transaction_type = 'NEW')
            and invh.created_at >= $1
        ) as invIn where rn = 1
        union all
        select pallet_id, seq, status, transaction_type, product_id, product_name, product_description,
        inventory_history_id, packing_type, qty, opening_qty, weight, opening_weight, created_at from (
          select row_number() over(partition by invh.pallet_id order by invh.seq asc) as rn, invh.* ,
          prd.name as product_name, prd.description as product_description 
          from temp_inv_history invh
          inner join temp_products prd on prd.id = invh.product_id
          where status = 'STORED' and invh.created_at < $1
        ) as invStored  where rn = 1
        union all
        select pallet_id, seq, status, transaction_type, product_id, product_name, product_description,
        inventory_history_id, packing_type, qty, opening_qty, weight, opening_weight, started_at as created_at from (
          select row_number() over(partition by invh.pallet_id order by invh.seq desc) as rn, invh.*,
          prd.name as product_name, prd.description as product_description, repeatedGroup.started_at
          from temp_inv_history invh
          inner join (
            select pallet_id, min(created_at) as started_at, max(created_at) as ended_at, min(seq) as min_seq, max(seq) as max_seq, status from (
              select startData.*, sum(startflag) over (partition by pallet_id order by seq) as grp from (
                select s.*,  
                (case when lag(status) over (partition by pallet_id order by seq) = status then 0 else 1 end) as startflag
                from temp_inv_history s
              ) startData
            ) endData
            group by pallet_id, grp, status
          ) repeatedGroup on repeatedGroup.pallet_id = invh.pallet_id and repeatedGroup.min_seq <= invh.seq and repeatedGroup.max_seq >= invh.seq
          inner join temp_products prd on prd.id = invh.product_id
        ) as invOut where rn = 1 and status ='TERMINATED'
        ) as invHistory         
        group by product_id, product_name, product_description
      ) invh
      where 1=1
      ${hasTransactionOrBalanceQuery}
    )
  `,
    [fromDate.value, toDate.value]
  )

  const total: any = await trxMgr.query(
    `select count(*) as count, sum(total_in_qty) as totalInQty, sum(opening_qty) as totalOpeningBal from temp_inventory_pallet_summary`
  )

  const result: any = await trxMgr.query(
    `
    select *, 'PALLET' as packing_type from temp_inventory_pallet_summary ORDER BY product_name, product_description OFFSET $1 LIMIT $2
  `,
    [(params.pagination.page - 1) * params.pagination.limit, params.pagination.limit]
  )

  trxMgr.query(`
    drop table temp_products, temp_inv_history, temp_inventory_pallet_summary
  `)

  return [result, total]
}

async function productsQuery(trxMgr: EntityManager, params: ListParam, bizplace: Bizplace) {
  let product = params.filters.find(data => data.name === 'product')
  let productDesc = params.filters.find(data => data.name === 'productDescription')

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
      'AND Lower(name) LIKE ANY(ARRAY[' +
      productValue +
      'OR Lower(sku) LIKE ANY(ARRAY[' +
      productValue +
      'OR Lower(description) LIKE ANY(ARRAY[' +
      productValue
  }

  let productDescQuery = ''
  if (productDesc) {
    productDescQuery = "AND Lower(description) LIKE '%" + productDesc.value.toLowerCase() + "%'"
  }

  await trxMgr.query(
    `
    create temp table temp_products AS
    (
      select *, prd.id::varchar as product_id from products prd where
      prd.bizplace_id = $1
      ${productQuery}
    )`,
    [bizplace.id]
  )
}

async function filterInventoryQuery(trxMgr: EntityManager, params: ListParam, bizplace: Bizplace, context: any) {
  let toDate = params.filters.find(data => data.name === 'toDate')
  let batchNo = params.filters.find(data => data.name === 'batchNo')

  let batchNoQuery = ''
  if (batchNo) {
    batchNoQuery =
      'AND Lower(ih.batch_id) LIKE ANY(ARRAY[' +
      batchNo.value
        .toLowerCase()
        .split(',')
        .map(prod => {
          return "'%" + prod.trim().replace(/'/g, "''") + "%'"
        })
        .join(',') +
      '])'
  }

  await trxMgr.query(
    `
    create temp table temp_inv_history as (
      select i2.pallet_id, i2.product_id, i2.packing_type, i2.batch_id,
      ih.id as inventory_history_id, ih.seq, ih.status, ih.transaction_type, ih.qty, ih.opening_qty, ih.weight, ih.opening_weight, ih.created_at
      from inventories i2
      inner join reduced_inventory_histories ih on ih.pallet_id = i2.pallet_id and ih.domain_id = i2.domain_id
      where
      i2.domain_id = $1
      and i2.bizplace_id = $2
      and ih.created_at <= $3
      ${batchNoQuery}
    )
  `,
    [context.state.domain.id, bizplace.id, toDate.value]
  )
}

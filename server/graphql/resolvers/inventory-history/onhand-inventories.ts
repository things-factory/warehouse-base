import { getPermittedBizplaceIds } from '@things-factory/biz-base'
import { getRepository, getManager, EntityManager } from 'typeorm'
import { User } from '@things-factory/auth-base'
import { BizplaceUser } from '@things-factory/biz-base'

export const onhandInventoriesResolver = {
  async onhandInventories(_: any, { filters, pagination, sortings, locationSortingRules }, context: any) {
    // define all inputs
    let userFilter = filters.find(data => data.name === 'user')
    let product = filters.find(data => data.name === 'product')
    let createdAt = filters.find(data => data.name === 'created_at')
    let location = filters.find(data => data.name === 'location')
    let batchId = filters.find(data => data.name === 'batchId')
    let palletId = filters.find(data => data.name === 'palletId')
    let packingType = filters.find(data => data.name === 'packingType')
    let timezoneOffset = filters.find(data => data.name === 'timezoneOffset')

    let bizplaceFilter = { name: '', operator: '', value: [] }

    // prepare query filters
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

      bizplaceFilter = { name: 'bizplace', operator: 'eq', value: [bizplaceUser.bizplace.id] }
    } else {
      bizplaceFilter = !filters.find((filter: any) => filter.name === 'bizplace')
        ? {
            name: 'bizplace',
            operator: 'in',
            value: await getPermittedBizplaceIds(context.state.domain, context.state.user),
            relation: true
          }
        : {
            ...filters.find(data => data.name === 'bizplace'),
            value: [filters.find(data => data.name === 'bizplace').value]
          }
    }

    let queryFilter = ``
    let bizplaces = bizplaceFilter.value
      .map(bc => {
        return "'" + bc + "'"
      })
      .join(',')

    queryFilter = `and exists (
        select bc.id from bizplaces bc where
        bc.id = any(array[${bizplaces}]::uuid[])
        and bc.id = rih.bizplace_id
      )`
    if (product) {
      let products = product.value
        .toLowerCase()
        .split(',')
        .map(prod => {
          return "'%" + prod.trim().replace(/'/g, "''") + "%'"
        })
        .join(',')

      queryFilter =
        queryFilter +
        ` and exists (
          select prd.id from products prd where
          prd.domain_id = '${context.state.domain.id}'
          and (lower(prd.name) like any(array[${products}])
          or lower(prd.description) like any(array[${products}])
          or lower(prd.sku) like any(array[${products}]))
          and prd.id = rih.product_id
        )`
    }

    if (location) {
      let locations = location.value
        .map(loc => {
          return "'" + loc + "'"
        })
        .join(',')

      queryFilter =
        queryFilter +
        ` and exists (
        select loc.id from locations loc where
        loc.id = any(array[${locations}]::uuid[])
        and loc.id = rih.location_id
      )`
    }

    let timeoffset = `min(ih.created_at)`
    if (timezoneOffset) {
      timeoffset = `${timeoffset} + '${-timezoneOffset.value} minutes'::interval`
    }

    if (batchId) queryFilter = queryFilter + ` and lower(rih.batch_id) like '${batchId.value.toLowerCase()}' `

    if (palletId) queryFilter = queryFilter + ` and rih.pallet_id like '${palletId.value}' `

    if (packingType) queryFilter = queryFilter + ` and rih.packing_type like '${packingType.value}' `

    // query the results
    return await getManager().transaction(async (trxMgr: EntityManager) => {
      await trxMgr.query(
        `
        create temp table tmp_src as (
          select domain_id, pallet_id, seq, qty, weight, packing_type, batch_id, created_at, status,
          product_id::uuid as product_id, bizplace_id::uuid as bizplace_id, location_id::uuid as location_id 
          from reduced_inventory_histories rih 
          where domain_id = $1 and created_at::date <=$2::date
        )  
      `,
        [context.state.domain.id, createdAt.value]
      )

      await trxMgr.query(
        `          
        create temp table tmp_data as (
          select dt.*, rih.batch_id, rih.product_id, rih.packing_type, rih.bizplace_id, rih.location_id from(
            select ih.domain_id, ih.pallet_id, sum(ih.qty) as qty, sum(ih.weight) as weight, max(ih.seq) as last_seq, max(ih.created_at) as created_at,
            ${timeoffset} as initial_inbound_at
            from tmp_src ih
            group by ih.domain_id, ih.pallet_id
          ) dt
          inner join tmp_src rih on dt.domain_id = rih.domain_id and dt.pallet_id = rih.pallet_id and dt.last_seq = rih.seq and rih.status <> 'TERMINATED'
          where 1=1
          ${queryFilter}
        )
      `
      )

      const total: any = await trxMgr.query(`select count(*) from tmp_data`)

      const result: any = await trxMgr.query(
        ` 
        select 
        rih.domain_id, rih.pallet_id, rih.qty, rih.weight, rih.last_seq, rih.created_at,
        rih.initial_inbound_at,
        case when iv.reusable_pallet_id is not null then concat(rih.batch_id, ' (', plt.name, ')') else rih.batch_id end as batch_id,
        rih.product_id, rih.packing_type, rih.bizplace_id, rih.location_id,
        prd.name as product_name, prd.sku as product_sku, prd.description as product_description,
        bz.name as bizplace_name,
        loc.name as location_name, loc."zone" as location_zone, loc."row" as location_row, loc."column" as location_column, loc.shelf as location_shelf,
        wh.name as warehouse_name, plt.name as reusable_pallet_name
        from tmp_data rih
        inner join inventories iv on iv.domain_id = rih.domain_id and iv.pallet_id = rih.pallet_id
        left join pallets plt on plt.id = iv.reusable_pallet_id
        inner join products prd on prd.id = rih.product_id
        inner join bizplaces bz on bz.id = rih.bizplace_id
        inner join locations loc on loc.id = rih.location_id
        inner join warehouses wh on wh.id = loc.warehouse_id
        order by created_at desc OFFSET $1 LIMIT $2
      `,
        [(pagination.page - 1) * pagination.limit, pagination.limit]
      )

      trxMgr.query(`
        drop table tmp_src, tmp_data
      `)

      // map all results
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
          product: {
            name: itm.product_name,
            description: itm.product_description,
            sku: itm.product_sku
          },
          palletId: itm.pallet_id,
          batchId: itm.batch_id,
          packingType: itm.packing_type,
          remainQty: itm.qty,
          initialInboundAt: timezoneOffset ? itm.initial_inbound_at : itm.initial_inbound_at
        }
      })

      return { items, total: total[0].count }
    })
  }
}

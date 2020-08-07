import { ViewEntity, ViewColumn, Index } from 'typeorm'
import { Bizplace } from '@things-factory/biz-base'
import { Domain } from '@things-factory/shell'

@ViewEntity({
  expression: `
    select * from inventory_histories ih where not exists (
      select ih2.* from inventory_histories ih2 
      where (ih2.transaction_type ='RETURN' or ih2.transaction_type ='CANCEL_ORDER') and
      ih.domain_id = ih2.domain_id and
      ih.pallet_id = ih2.pallet_id and
      ih.ref_order_id = ih2.ref_order_id
    )
    `
})
export class ReducedInventoryHistory {
  @ViewColumn()
  id: string

  @ViewColumn()
  seq: number

  @ViewColumn()
  domain: Domain

  @ViewColumn()
  bizplace: Bizplace

  @ViewColumn()
  refOrderId: string

  @ViewColumn()
  orderNo: string

  @ViewColumn()
  name: string

  @ViewColumn()
  palletId: string

  @ViewColumn()
  batchId: string

  @ViewColumn()
  productId: string

  @ViewColumn()
  warehouseId: string

  @ViewColumn()
  locationId: string

  @ViewColumn()
  zone: string

  @ViewColumn()
  orderRefNo: string

  @ViewColumn()
  packingType: string

  @ViewColumn()
  unit: string

  @ViewColumn()
  qty: number

  @ViewColumn()
  openingQty: number

  @ViewColumn()
  weight: number

  @ViewColumn()
  openingWeight: number

  @ViewColumn()
  status: string

  @ViewColumn()
  transactionType: String
}

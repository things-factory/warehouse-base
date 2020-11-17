import { ViewEntity, ViewColumn, Index } from 'typeorm'
import { Bizplace } from '@things-factory/biz-base'
import { Domain } from '@things-factory/shell'

@ViewEntity({
  expression: `
    select ih.* from inventory_histories ih 
    where not exists (
      select ih2.id from inventory_histories ih2 
      where (ih2.transaction_type ='RETURN' or ih2.transaction_type ='CANCEL_ORDER') and
      ih2.domain_id = ih.domain_id and
      ih2.pallet_id = ih.pallet_id and
      ih2.ref_order_id = ih.ref_order_id
    ) and not exists 
    (
      select ih3.id from inventory_histories ih3 where
      ih3.domain_id = ih.domain_id and 
      ih3.pallet_id = ih.pallet_id and 
      (ih3.seq = ih.seq + 1 or ih3.seq = ih.seq) and 
      ih3.transaction_type ='UNDO_UNLOADING'
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
  stdUnit: string

  @ViewColumn()
  stdUnitValue: number

  @ViewColumn()
  openingStdUnitValue: number

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

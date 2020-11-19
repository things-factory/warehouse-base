import { User } from '@things-factory/auth-base'
import { Bizplace } from '@things-factory/biz-base'
import { Domain } from '@things-factory/shell'
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Pallet, Inventory } from '.'

@Entity()
@Index(
  'ix_inventory-history_0',
  (inventoryHistory: InventoryHistory) => [inventoryHistory.domain, inventoryHistory.name],
  { unique: true }
)
export class InventoryHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ default: 0 })
  seq: number

  @ManyToOne(type => Domain)
  domain: Domain

  @ManyToOne(type => Bizplace)
  bizplace: Bizplace

  @Column({
    nullable: true
  })
  refOrderId: string

  @Column({
    nullable: true
  })
  orderNo: string

  @Column()
  name: string

  @Column({
    nullable: true
  })
  palletId: string

  @Column({
    nullable: true
  })
  batchId: string

  @ManyToOne(type => Pallet, {
    nullable: true
  })
  reusablePallet: Pallet

  @Column()
  productId: string

  @Column()
  warehouseId: string

  @Column()
  locationId: string

  @Column({
    nullable: true
  })
  zone: string

  @Column({
    nullable: true
  })
  orderRefNo: string

  @Column()
  packingType: string

  @Column('float')
  qty: number

  @Column('float', { default: 0, nullable: true })
  openingQty: number

  @Column('float', {
    nullable: true
  })
  weight: number

  @Column('float', { default: 0, nullable: true })
  openingWeight: number

  @Column({
    nullable: true
  })
  uom: string

  @Column('float', {
    nullable: true
  })
  uomValue: number

  @Column('float', { default: 0, nullable: true })
  openingUomValue: number


  @Column({
    nullable: true
  })
  description: string

  @Column()
  status: string

  @Column()
  transactionType: String

  @ManyToOne(type => Inventory, {
    nullable: true
  })
  inventory: Inventory

  @ManyToOne(type => User, {
    nullable: true
  })
  creator: User

  @ManyToOne(type => User, {
    nullable: true
  })
  updater: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

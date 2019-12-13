import { User } from '@things-factory/auth-base'
import { Bizplace } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'
import { Domain } from '@things-factory/shell'
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Location } from './location'
import { Warehouse } from './warehouse'

@Entity('inventories')
@Index('ix_inventory_0', (inventory: Inventory) => [inventory.domain, inventory.id], { unique: true })
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @ManyToOne(type => Bizplace)
  bizplace: Bizplace

  @ManyToOne(type => Inventory)
  refInventory: Inventory

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

  @Column({
    nullable: true
  })
  refOrderId: string

  @Column({
    nullable: true
  })
  orderRefNo: string

  @ManyToOne(type => Product)
  product: Product

  @ManyToOne(type => Warehouse, {
    nullable: true
  })
  warehouse: Warehouse

  @ManyToOne(type => Location)
  location: Location

  @Column({
    nullable: true
  })
  zone: string

  @Column()
  packingType: string

  @Column({
    nullable: true
  })
  unit: string

  @Column('float', {
    nullable: true
  })
  weight: number

  @Column('float', {
    nullable: true
  })
  lockedWeight: number

  @Column('float')
  qty: number

  @Column('float', {
    nullable: true
  })
  lockedQty: number

  @Column({ default: 0 })
  lastSeq: number

  @Column({
    nullable: true
  })
  description: string

  @Column()
  status: string

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

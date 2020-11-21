import { User } from '@things-factory/auth-base'
import { Bizplace } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'
import { Domain } from '@things-factory/shell'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Location } from './location'
import { Warehouse } from './warehouse'
import { InventoryChange } from './inventory-change'
import { Pallet } from '.'

@Entity('inventories')
@Index('ix_inventory_0', (inventory: Inventory) => [inventory.domain, inventory.id, inventory.palletId], {
  unique: true
})
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

  @Column()
  palletId: string

  @Column({
    nullable: true
  })
  batchId: string

  @Column({
    nullable: true
  })
  refOrderId: string

  /**
   * Expected: Putting ManyToOne relation with OrderProduct to find out unloaded inventories within unloading process
   * Because if there's inventory which has same batch id with others but different product id
   * then can't find out exact same inventory by batch id as a condition to find
   *
   * Problem: Because of circular dependency problem.
   * OrderProduct entity comes from sales-base module and the module is looking for warehouse-base module
   *
   * Solution: Putting plain orderProductId field instead of ManyToOne relation for this release (2.2.0-beta)
   */
  @Column({
    nullable: true
  })
  orderProductId: string

  @ManyToOne(type => Pallet, {
    nullable: true
  })
  reusablePallet: Pallet

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
  uom: string

  @Column('float', {
    nullable: true
  })
  uomValue: number

  @Column('float', {
    nullable: true
  })
  lockedUomValue: number

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

  @Column({
    nullable: true
  })
  otherRef: string

  @Column({
    nullable: true
  })
  remark: string

  @OneToMany(type => InventoryChange, inventoryChanges => inventoryChanges.inventory)
  inventoryChanges: InventoryChange[]

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

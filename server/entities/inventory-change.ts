import { User } from '@things-factory/auth-base'
import { Bizplace } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'
import { Domain } from '@things-factory/shell'
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Location } from './location'
import { Warehouse } from './warehouse'
import { Inventory } from './inventory'

@Entity()
@Index('ix_inventory-change_0', (inventoryChange: InventoryChange) => [inventoryChange.domain, inventoryChange.id], {
  unique: true
})
export class InventoryChange {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  palletId: string

  @ManyToOne(type => Domain)
  domain: Domain

  @Column({
    nullable: true
  })
  oriBatchId: string

  @ManyToOne(type => Bizplace)
  oriBizplace: Bizplace

  @ManyToOne(type => Product)
  oriProduct: Product

  @ManyToOne(type => Location)
  oriLocation: Location

  @Column()
  oriPackingType: string

  @Column({
    nullable: true
  })
  oriUnit: string

  @Column('float', {
    nullable: true
  })
  oriWeight: number

  @Column('float')
  oriQty: number

  @Column({
    nullable: true
  })
  batchId: string

  @ManyToOne(type => Bizplace)
  bizplace: Bizplace

  @ManyToOne(type => Inventory)
  inventory: Inventory

  @ManyToOne(type => Product)
  product: Product

  @ManyToOne(type => Location)
  location: Location

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

  @Column('float')
  qty: number

  @Column()
  status: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(type => User, {
    nullable: true
  })
  creator: User

  @ManyToOne(type => User, {
    nullable: true
  })
  updater: User
}

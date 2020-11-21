import { User } from '@things-factory/auth-base'
import { Bizplace } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'
import { Domain } from '@things-factory/shell'
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Location, Inventory, InventoryHistory } from '../entities'
@Entity()
@Index('ix_inventory-change_0', (inventoryChange: InventoryChange) => [inventoryChange.domain, inventoryChange.id], {
  unique: true
})
export class InventoryChange {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ nullable: true })
  palletId: string

  @ManyToOne(type => Domain)
  domain: Domain

  @Column({
    nullable: true
  })
  batchId: string

  @ManyToOne(type => Bizplace, {
    nullable: true
  })
  bizplace: Bizplace

  @ManyToOne(type => Inventory, {
    nullable: true
  })
  inventory: Inventory

  @ManyToOne(type => Product, {
    nullable: true
  })
  product: Product

  @ManyToOne(type => Location, {
    nullable: true
  })
  location: Location

  @Column({
    nullable: true
  })
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
  uomValue: number

  @Column('float', {
    nullable: true
  })
  qty: number

  @Column()
  status: string

  @ManyToOne(type => InventoryHistory, {
    nullable: true
  })
  lastInventoryHistory: InventoryHistory

  @Column()
  transactionType: string

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

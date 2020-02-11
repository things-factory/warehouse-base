import { User } from '@things-factory/auth-base'
import { Bizplace } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'
import { Domain } from '@things-factory/shell'
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Location } from './location'
import { Warehouse } from './warehouse'
import { Inventory } from './inventory'

@Entity()
@Index('ix_inventory-change_0', (inventoryChange: InventoryChange) => [inventoryChange.domain, inventoryChange.name], {
  unique: true
})
export class InventoryChange {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  palletId: string

  @Column({
    nullable: true
  })
  batchId: string

  @ManyToOne(type => Domain)
  domain: Domain

  @ManyToOne(type => Bizplace)
  bizplace: Bizplace

  @ManyToOne(type => Inventory)
  inventory: Inventory

  @ManyToOne(type => Product)
  product: Product

  @ManyToOne(type => Warehouse)
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

  @Column('float')
  qty: number

  @Column({
    nullable: true
  })
  description: string

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

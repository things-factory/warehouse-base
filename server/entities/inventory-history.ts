import { User } from '@things-factory/auth-base'
import { Bizplace } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'
import { Domain } from '@things-factory/shell'
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Location } from './location'

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

  @ManyToOne(type => Product)
  product: Product

  @ManyToOne(type => Location)
  location: Location

  @Column('float')
  qty: number

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

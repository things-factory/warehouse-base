import { User } from '@things-factory/auth-base'
import { Bizplace } from '@things-factory/biz-base'
import { Domain } from '@things-factory/shell'
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

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

  @Column()
  packingType: string

  @Column('float')
  qty: number

  @Column({
    nullable: true
  })
  description: string

  @Column()
  status: string

  @Column()
  transactionType: String

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

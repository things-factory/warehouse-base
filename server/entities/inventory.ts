import { User } from '@things-factory/auth-base'
import { Lot, ProductBatch } from '@things-factory/product-base'
import { Domain } from '@things-factory/shell'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('inventories')
@Index('ix_inventory_0', (inventory: Inventory) => [inventory.domain, inventory.name], {
  unique: true
})
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @Column()
  name: string

  @ManyToOne(type => ProductBatch)
  productBatch: ProductBatch

  @OneToOne(type => Lot)
  lot: Lot

  @Column('float')
  qty: number

  @Column({
    nullable: true
  })
  description: string

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

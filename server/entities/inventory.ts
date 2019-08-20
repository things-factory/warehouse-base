import { User } from '@things-factory/auth-base'
import { Product, ProductBatch } from '@things-factory/sales-base'
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
import { Location } from '../entities/location'

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

  @ManyToOne(type => Product)
  product: Product

  @OneToOne(type => Location)
  location: Location

  @ManyToOne(type => ProductBatch)
  productBatch: ProductBatch

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

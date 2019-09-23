import { User } from '@things-factory/auth-base'
import { Product, Bizplace } from '@things-factory/sales-base'
import { Domain } from '@things-factory/shell'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Location } from './location'
import { Movement } from './movement'

@Entity('inventories')
@Index('ix_inventory_0', (inventory: Inventory) => [inventory.domain, inventory.name], {
  unique: true
})
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @ManyToOne(type => Bizplace)
  bizplace: Bizplace

  @Column()
  name: string

  @ManyToOne(type => Product)
  product: Product

  @ManyToOne(type => Location)
  location: Location

  @OneToMany(type => Movement, movement => movement.inventory)
  movements: Movement[]

  @Column('float')
  startQty: number

  @Column('float')
  endQty: number

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

import { User } from '@things-factory/auth-base'
import { Bizplace } from '@things-factory/biz-base'
import { Product } from '@things-factory/sales-base'
import { Domain } from '@things-factory/shell'
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Warehouse } from './warehouse'

@Entity('movements')
@Index('ix_movement_0', (movement: Movement) => [movement.domain], { unique: true })
export class Movement {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @Column('date')
  date: Date

  @ManyToOne(type => Warehouse)
  warehouse: Warehouse

  @ManyToOne(type => Bizplace)
  bizplace: Bizplace

  @ManyToOne(type => Product)
  product: Product

  @Column('float')
  startQty: number

  @Column('float')
  inQty: number

  @Column('float')
  outQty: number

  @Column('float')
  endQty: number

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

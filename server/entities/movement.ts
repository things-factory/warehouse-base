import { Entity, Index, Column, OneToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Domain, DomainBaseEntity } from '@things-factory/shell'
import { Warehouse } from './warehouse'
import { Bizplace } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'

@Entity('movements')
@Index('ix_movement_0', (movement: Movement) => [movement.domain], { unique: true })
export class Movement extends DomainBaseEntity {
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

  @Column('text', {
    nullable: true
  })
  description: string
}

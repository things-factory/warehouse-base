import { Entity, Index, Column, OneToMany, ManyToOne, PrimaryGeneratedColumn, OneToOne } from 'typeorm'
import { Domain, DomainBaseEntity } from '@things-factory/shell'
import { Warehouse } from './warehouse'
import { ProductBatch, Lot } from '@things-factory/product-base'

@Entity('locations')
@Index('ix_location_0', (location: Location) => [location.domain, location.name], { unique: true })
export class Location extends DomainBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @ManyToOne(type => Warehouse, warehouse => warehouse.locations)
  warehouse: Warehouse

  @ManyToOne(type => ProductBatch)
  productBatch: ProductBatch

  @OneToOne(type => Lot)
  lot: Lot

  @Column('float')
  qty: number

  @Column('text')
  name: string

  @Column({ type: 'text', comment: 'occupied, hold, empty' })
  state: string

  @Column('text', {
    nullable: true
  })
  description: string
}

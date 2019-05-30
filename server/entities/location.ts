import { Entity, Index, Column, OneToMany, ManyToOne, PrimaryGeneratedColumn, OneToOne } from 'typeorm'
import { Domain, DomainBaseEntity } from '@things-factory/shell'
import { Warehouse } from './warehouse'

@Entity('locations')
@Index('ix_location_0', (location: Location) => [location.domain, location.name], { unique: true })
export class Location extends DomainBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @ManyToOne(type => Warehouse, warehouse => warehouse.locations)
  warehouse: Warehouse

  @Column('text')
  name: string

  @Column('text')
  zone: string

  @Column('text')
  section: string

  @Column('text')
  unit: string

  @Column('text')
  shelf: string

  @Column({ type: 'text', comment: 'occupied, hold, empty' })
  state: string

  @Column('text', {
    nullable: true
  })
  description: string
}

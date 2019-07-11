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

  @Column()
  name: string

  @Column()
  zone: string

  @Column()
  section: string

  @Column()
  unit: string

  @Column()
  shelf: string

  @Column({ type: 'text', comment: 'occupied, hold, empty' })
  state: string

  @Column({
    nullable: true
  })
  description: string
}

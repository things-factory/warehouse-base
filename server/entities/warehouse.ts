import { Entity, Index, Column, OneToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Domain, DomainBaseEntity } from '@things-factory/shell'
import { Location } from './location'

@Entity('warehouses')
@Index('ix_warehouse_0', (warehouse: Warehouse) => [warehouse.domain, warehouse.name], { unique: true })
export class Warehouse extends DomainBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @Column()
  name: string

  @OneToMany(type => Location, location => location.warehouse)
  locations: Location[]

  @Column({
    nullable: true
  })
  description: string
}

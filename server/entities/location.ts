import { User } from '@things-factory/auth-base'
import { Domain } from '@things-factory/shell'
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Inventory } from './inventory'
import { Warehouse } from './warehouse'

@Entity('locations')
@Index('ix_location_0', (location: Location) => [location.domain, location.name], { unique: true })
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @ManyToOne(type => Warehouse, warehouse => warehouse.locations, {
    nullable: false
  })
  warehouse: Warehouse

  @Column()
  name: string

  @Column({
    nullable: true
  })
  description: string

  @Column({
    nullable: true
  })
  type: string

  @Column()
  zone: string

  @Column()
  row: string

  @Column()
  column: string

  @Column()
  shelf: string

  @Column({ type: 'text', comment: 'occupied, hold, empty' })
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

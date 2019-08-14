import { User } from '@things-factory/auth-base'
import { Product } from '@things-factory/sales-base'
import { Domain } from '@things-factory/shell'
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Warehouse } from './warehouse'

@Entity('locations')
@Index('ix_location_0', (location: Location) => [location.domain, location.name], { unique: true })
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @ManyToOne(type => Warehouse, warehouse => warehouse.locations)
  warehouse: Warehouse

  @ManyToOne(type => Product)
  product: Product

  @Column()
  name: string

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

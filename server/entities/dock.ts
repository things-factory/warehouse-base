import { User } from '@things-factory/auth-base'
import { Domain } from '@things-factory/shell'
import { Warehouse } from './warehouse'
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
@Index('ix_dock_0', (dock: Dock) => [dock.domain, dock.name], { unique: true })
export class Dock {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @Column()
  name: string

  @Column({
    nullable: true
  })
  description: string

  @Column()
  status: string

  @Column()
  type: string

  @ManyToOne(type => Warehouse)
  warehouse: Warehouse

  @Column({
    nullable: true
  })
  startedAt: Date

  @Column({
    nullable: true
  })
  endedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(type => User, {
    nullable: true
  })
  creator: User

  @ManyToOne(type => User, {
    nullable: true
  })
  updater: User
}

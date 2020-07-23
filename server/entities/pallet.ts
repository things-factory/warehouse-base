import { User } from '@things-factory/auth-base'
import { Bizplace } from '@things-factory/biz-base'
import { Domain } from '@things-factory/shell'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Inventory } from '.'

@Entity()
@Index('ix_pallet_0', (pallet: Pallet) => [pallet.domain, pallet.name], { unique: true })
export class Pallet {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @Column()
  name: string

  @Column({ default: 0 })
  seq: number

  @ManyToOne(type => Bizplace)
  owner: Bizplace

  @ManyToOne(type => Bizplace)
  holder: Bizplace

  @OneToOne(type => Inventory, { nullable: true })
  @JoinColumn()
  inventory: Inventory

  @Column({
    nullable: true
  })
  refOrderNo: string

  @Column()
  status: string

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

import { User } from '@things-factory/auth-base'
import { Bizplace } from '@things-factory/biz-base'
import { Domain } from '@things-factory/shell'
import {
  Column, CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm'
import { Pallet } from '../entities'

@Entity()
@Index('ix_pallet-history_0', (palletHistory: PalletHistory) => [palletHistory.domain, palletHistory.id], {
  unique: true
})
export class PalletHistory {
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

  @ManyToOne(type => Pallet)
  pallet: Pallet

  @Column()
  status: string

  @Column()
  transactionType: string

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

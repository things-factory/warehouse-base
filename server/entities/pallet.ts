import { CreateDateColumn, UpdateDateColumn, Entity, Index, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Domain } from '@things-factory/shell'
import { User } from '@things-factory/auth-base'
import { Bizplace } from '@things-factory/biz-base'

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

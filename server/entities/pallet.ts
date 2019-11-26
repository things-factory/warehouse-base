import { CreateDateColumn, UpdateDateColumn, Entity, Index, Column, OneToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Domain } from '@things-factory/shell'
import { User } from '@things-factory/auth-base'

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

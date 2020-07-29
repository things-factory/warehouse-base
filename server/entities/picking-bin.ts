import { CreateDateColumn, UpdateDateColumn, Entity, Index, Column, OneToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Domain } from '@things-factory/shell'
import { User } from '@things-factory/auth-base'

@Entity()
@Index('ix_picking-bin_0', (pickingBin: PickingBin) => [pickingBin.domain, pickingBin.name], { unique: true })
export class PickingBin {
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

import { Entity, Index, Column, OneToOne, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Domain, DomainBaseEntity } from '@things-factory/shell'
import { ProductBatch, Lot } from '@things-factory/product-base'

@Entity('inventories')
@Index('ix_inventory_0', (inventory: Inventory) => [inventory.domain, inventory.name], {
  unique: true
})
export class Inventory extends DomainBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @Column('text')
  name: string

  @ManyToOne(type => ProductBatch)
  productBatch: ProductBatch

  @OneToOne(type => Lot)
  lot: Lot

  @Column('float')
  qty: number

  @Column('text', {
    nullable: true
  })
  description: string
}

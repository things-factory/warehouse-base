import { Bizplace } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'
import { getManager, MoreThan, In } from 'typeorm'
import { Inventory, InventoryHistory, Location, InventoryChange } from '../../../entities'
import { InventoryNoGenerator } from '../../../utils'
import { INVENTORY_STATUS } from '../../../constants'

export const rejectInventoryChanges = {
  async rejectInventoryChanges(_: any, { patches }, context: any) {
    return await getManager().transaction(async trxMgr => {
      const _inventoryChanges = await trxMgr.getRepository(InventoryChange).find({
        where: { id: In(patches.map(item => item.id)) },
        relations: [
          'inventory',
          'inventory.bizplace',
          'inventory.product',
          'inventory.location',
          'inventory.warehouse',
          'bizplace',
          'product',
          'location'
        ]
      })

      if (_inventoryChanges.length > 0) {
        for (let i = 0; i < _inventoryChanges.length; i++) {
          if (_inventoryChanges[i].status.toLocaleLowerCase() != 'pending') return true
          _inventoryChanges[i].status = 'REJECTED'

          // Get last row of InventoryHistory
          let latestEntry = await trxMgr.getRepository(InventoryHistory).find({
            where: { palletId: _inventoryChanges[i].palletId },
            order: { seq: 'DESC' },
            take: 1
          })

          if (latestEntry.length > 0) _inventoryChanges[i].lastInventoryHistory = latestEntry[0]
        }

        await trxMgr
          .getRepository(InventoryChange)
          .save(_inventoryChanges.filter(change => change.status == 'REJECTED'))
      }
      return true
    })
  }
}

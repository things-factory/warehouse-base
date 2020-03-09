import { Bizplace } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'
import { getManager, MoreThan, In } from 'typeorm'
import { Inventory, InventoryHistory, Location, InventoryChange } from '../../../entities'
import { InventoryNoGenerator } from '../../../utils'
import { INVENTORY_STATUS } from '../../../constants'

export const approveInventoryChanges = {
  async approveInventoryChanges(_: any, { patches }, context: any) {
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

          if (_inventoryChanges[i].inventory != null) {
            let inventoryId = _inventoryChanges[i].inventory.id
            const newRecord: Inventory = JSON.parse(JSON.stringify(_inventoryChanges[i]))
            const newHistoryRecord: InventoryHistory = JSON.parse(JSON.stringify(_inventoryChanges[i]))
            let transactionType = ''
            let inventory: Inventory = _inventoryChanges[i].inventory

            newHistoryRecord.openingQty = inventory.qty
            newHistoryRecord.openingWeight = inventory.weight
            // Get last sequence from InventoryHistory
            let latestEntry = await trxMgr.getRepository(InventoryHistory).find({
              where: { palletId: inventory.palletId },
              order: { seq: 'DESC' },
              take: 1
            })
            let lastSeq = latestEntry[0].seq

            if (newRecord.location.id != inventory.location.id) {
              newRecord.zone = newRecord.location.zone
              newRecord.warehouse = newRecord.location.warehouse
              transactionType = 'RELOCATE'
            }

            if (newRecord.qty != inventory.qty) {
              newHistoryRecord.qty = newRecord.qty - inventory.qty
              if (newRecord.qty < 1) {
                newRecord.qty = 0
                newRecord.weight = 0
              }
              transactionType = 'ADJUSTMENT'
            } else {
              newHistoryRecord.qty = 0
            }

            if (newRecord.weight != inventory.weight) {
              newHistoryRecord.weight = newRecord.weight - inventory.weight
              if (newRecord.weight < 1) {
                newRecord.weight = 0
              }
              transactionType = 'ADJUSTMENT'
            } else {
              newHistoryRecord.weight = 0
            }

            if (
              inventory.bizplace.id !== (newRecord.bizplace ? newRecord.bizplace.id : '') ||
              inventory.product.id !== (newRecord.product ? newRecord.product.id : '') ||
              inventory.batchId !== newRecord.batchId ||
              inventory.packingType !== newRecord.packingType
            ) {
              transactionType = 'ADJUSTMENT'
              lastSeq = lastSeq + 1
              let inventoryHistory = {
                ...inventory,
                domain: context.state.domain,
                bizplace: inventory.bizplace.id,
                openingQty: inventory.qty,
                openingWeight: inventory.weight,
                qty: -inventory.qty || 0,
                weight: -inventory.weight || 0,
                name: InventoryNoGenerator.inventoryHistoryName(),
                seq: lastSeq,
                transactionType: transactionType,
                status: INVENTORY_STATUS.TERMINATED,
                productId: inventory.product.id,
                warehouseId: inventory.warehouse.id,
                locationId: inventory.location.id,
                creator: context.state.user,
                updater: context.state.user
              }
              delete inventoryHistory.id
              await trxMgr.getRepository(InventoryHistory).save(inventoryHistory)
              newHistoryRecord.qty = newRecord.qty || inventory.qty
              newHistoryRecord.weight = newRecord.weight || inventory.weight || 0
              newHistoryRecord.openingQty = 0
              newHistoryRecord.openingWeight = 0
              newHistoryRecord.batchId = newRecord.batchId || inventory.batchId || '-'
            }
            lastSeq = lastSeq + 1
            let inventoryHistory = {
              ...inventory,
              ...newHistoryRecord,
              domain: context.state.domain,
              creator: context.state.user,
              updater: context.state.user,
              name: InventoryNoGenerator.inventoryHistoryName(),
              status: newRecord.qty > 0 ? 'STORED' : 'TERMINATED',
              seq: lastSeq,
              transactionType: transactionType == '' ? 'ADJUSTMENT' : transactionType,
              productId: newHistoryRecord.productId ? newHistoryRecord.productId : inventory.product.id,
              warehouseId: newHistoryRecord.warehouseId ? newHistoryRecord.warehouseId : inventory.warehouse.id,
              locationId: newHistoryRecord.locationId ? newHistoryRecord.locationId : inventory.location.id
            }
            delete inventoryHistory.id
            await trxMgr.getRepository(InventoryHistory).save(inventoryHistory)
            await trxMgr.getRepository(Inventory).save({
              ...inventory,
              ...newRecord,
              id: inventoryId,
              status: newRecord.qty > 0 ? 'STORED' : 'TERMINATED',
              updater: context.state.user,
              lastSeq: lastSeq
            })

            _inventoryChanges[i].status = 'APPROVED'
          }
        }

        await trxMgr.getRepository(InventoryChange).save(_inventoryChanges)
      }

      return true
    })
  }
}

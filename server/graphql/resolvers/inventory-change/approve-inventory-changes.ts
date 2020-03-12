import { Bizplace } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'
import { getManager, MoreThan, In } from 'typeorm'
import { Inventory, InventoryHistory, Location, InventoryChange } from '../../../entities'
import { InventoryNoGenerator } from '../../../utils'
import { INVENTORY_STATUS, LOCATION_STATUS } from '../../../constants'

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
        let today = new Date()
        let year = today.getFullYear()
        let month = today.getMonth()
        let date = today.getDate()

        for (let i = 0; i < _inventoryChanges.length; i++) {
          if (_inventoryChanges[i].status.toLocaleLowerCase() != 'pending') return true

          const newRecord: Inventory = JSON.parse(JSON.stringify(_inventoryChanges[i]))
          const newHistoryRecord: InventoryHistory = JSON.parse(JSON.stringify(_inventoryChanges[i]))

          if (_inventoryChanges[i].inventory != null) {
            let inventoryId = _inventoryChanges[i].inventory.id
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
          } else {
            const total = await trxMgr.getRepository(Inventory).count({
              createdAt: MoreThan(new Date(year, month, date))
            })

            let palletId =
              'P' +
              year.toString().substr(year.toString().length - 2) +
              ('0' + (month + 1).toString()).substr(('0' + (month + 1).toString()).toString().length - 2) +
              ('0' + date.toString()).substr(('0' + date.toString()).length - 2) +
              ('0000' + (total + 1).toString()).substr(('0000' + (total + 1).toString()).length - 4)

            var location = await trxMgr.getRepository(Location).findOne({
              where: { id: newRecord.location.id },
              relations: ['warehouse']
            })
            newRecord.location = location
            newRecord.zone = location.zone
            newRecord.warehouse = location.warehouse

            newRecord.status = INVENTORY_STATUS.STORED
            newRecord.name = palletId
            newRecord.palletId = palletId

            let savedInventory = await trxMgr.getRepository(Inventory).save({
              ...newRecord,
              domain: context.state.domain,
              creator: context.state.user,
              updater: context.state.user,
              lastSeq: 0
            })

            await trxMgr.getRepository(InventoryHistory).save({
              ...newRecord,
              domain: context.state.domain,
              creator: context.state.user,
              updater: context.state.user,
              name: InventoryNoGenerator.inventoryHistoryName(),
              seq: 0,
              transactionType: 'NEW',
              productId: newRecord.product.id,
              warehouseId: newRecord.warehouse.id,
              locationId: newRecord.location.id
            })

            await trxMgr.getRepository(Location).save({
              ...location,
              status: LOCATION_STATUS.OCCUPIED
            })

            _inventoryChanges[i].inventory = savedInventory
            _inventoryChanges[i].palletId = savedInventory.palletId
          }

          _inventoryChanges[i].status = 'APPROVED'
        }

        await trxMgr.getRepository(InventoryChange).save(_inventoryChanges)
      }

      return true
    })
  }
}
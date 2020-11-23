import { generateId } from '@things-factory/id-rule-base'
import { getManager, In, MoreThan, Not } from 'typeorm'
import { INVENTORY_STATUS, LOCATION_STATUS } from '../../../constants'
import { Inventory, InventoryChange, InventoryHistory, Location } from '../../../entities'
import { InventoryNoGenerator } from '../../../utils'

export const approveInventoryChanges = {
  async approveInventoryChanges(_: any, { patches }, context: any) {
    return await getManager().transaction(async trxMgr => {
      // Get Selected Inventory Change Data
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
        ],
        order: {
          createdAt: 'ASC'
        }
      })

      let arrLockedInventory: InventoryChange[] = []

      if (_inventoryChanges.length > 0) {
        let today = new Date()
        let year = today.getFullYear()
        let month = today.getMonth()
        let date = today.getDate()

        for (let i = 0; i < _inventoryChanges.length; i++) {
          if (_inventoryChanges[i].status.toLocaleLowerCase() != 'pending') continue

          const newRecord: Inventory = JSON.parse(JSON.stringify(_inventoryChanges[i]))
          const newHistoryRecord: InventoryHistory = JSON.parse(JSON.stringify(_inventoryChanges[i]))

          // Adjustment of existing Inventory
          if (_inventoryChanges[i].inventory != null) {
            let inventoryId = _inventoryChanges[i].inventory.id
            let inventory: Inventory = await trxMgr.getRepository(Inventory).findOne({
              where: { id: inventoryId },
              relations: ['domain', 'bizplace', 'product', 'warehouse', 'location', 'creator', 'updater']
            })

            if (inventory.lockedQty > 0) {
              arrLockedInventory.push(_inventoryChanges[i])
              continue
            }

            let lastSeq = inventory.lastSeq

            let transactionType = ''

            newHistoryRecord.openingQty = inventory.qty
            newHistoryRecord.openingUomValue = inventory.uomValue

            // Get last row of InventoryHistory
            let latestEntry = await trxMgr.getRepository(InventoryHistory).find({
              where: { palletId: inventory.palletId, domain: context.state.domain },
              order: { seq: 'DESC' },
              take: 1
            })
            _inventoryChanges[i].lastInventoryHistory = latestEntry[0]

            // Check Change of existing inventory location
            if (newRecord.location && newRecord.location.id != inventory.location.id) {
              newRecord.zone = newRecord.location.zone
              newRecord.warehouse = newRecord.location.warehouse
              transactionType = 'ADJUSTMENT'

              // Check and set current location status
              let currentLocationInventoryCount = await trxMgr.getRepository(Inventory).count({
                where: { location: inventory.location, status: 'STORED', id: Not(inventory.id) }
              })

              if (currentLocationInventoryCount == 0) {
                let currentLocation = await trxMgr.getRepository(Location).findOne({
                  where: { id: inventory.location.id }
                })
                await trxMgr.getRepository(Location).save({
                  ...currentLocation,
                  status: LOCATION_STATUS.EMPTY
                })
              }
            }

            // Check Change of existing inventory quantity
            if (newRecord.qty != null && newRecord.qty != inventory.qty) {
              newHistoryRecord.qty = newRecord.qty - inventory.qty
              if (newRecord.qty < 1) {
                newRecord.qty = 0
                newRecord.uomValue = 0
              }
              transactionType = 'ADJUSTMENT'
            } else {
              newHistoryRecord.qty = 0
            }

            // Check Change of existing inventory uomValue
            if (newRecord.uomValue != null && newRecord.uomValue != inventory.uomValue) {
              newHistoryRecord.uomValue = newRecord.uomValue - inventory.uomValue
              Math.round(newHistoryRecord.uomValue * 100) / 100
              if (newRecord.uomValue < 1) {
                newRecord.uomValue = 0
              }
              transactionType = 'ADJUSTMENT'
            } else {
              newHistoryRecord.uomValue = 0
            }

            // Terminate current inventory history if there is change of bizplace, product, batchId, or packingType
            if (
              (newRecord.bizplace && inventory.bizplace.id !== newRecord.bizplace.id) ||
              (newRecord.product && inventory.product.id !== newRecord.product.id) ||
              (newRecord.batchId && inventory.batchId !== newRecord.batchId) ||
              (newRecord.packingType && inventory.packingType !== newRecord.packingType)
            ) {
              transactionType = 'ADJUSTMENT'
              lastSeq = lastSeq + 1
              let inventoryHistory = {
                ...inventory,
                domain: context.state.domain,
                bizplace: inventory.bizplace.id,
                openingQty: inventory.qty,
                openingUomValue: inventory.uomValue,
                qty: -inventory.qty || 0,
                uomValue: -inventory.uomValue || 0,
                name: InventoryNoGenerator.inventoryHistoryName(),
                seq: lastSeq,
                transactionType: transactionType,
                status: INVENTORY_STATUS.TERMINATED,
                productId: inventory.product.id,
                warehouseId: inventory.warehouse.id,
                locationId: inventory.location.id,
                packingType: inventory.packingType,
                creator: context.state.user,
                updater: context.state.user,
                inventory: inventory
              }
              delete inventoryHistory.id
              await trxMgr.getRepository(InventoryHistory).save(inventoryHistory)
              newHistoryRecord.qty = newRecord.qty != null ? newRecord.qty : inventory.qty || 0
              newHistoryRecord.uomValue = newRecord.uomValue != null ? newRecord.uomValue : inventory.uomValue || 0
              newHistoryRecord.openingQty = 0
              newHistoryRecord.openingUomValue = 0
            }

            // Set and update inventory and inventory history data
            lastSeq = lastSeq + 1
            clean(newHistoryRecord)
            let inventoryHistory = {
              ...inventory,
              ...newHistoryRecord,
              domain: context.state.domain,
              creator: context.state.user,
              updater: context.state.user,
              name: InventoryNoGenerator.inventoryHistoryName(),
              status: 'STORED',
              seq: lastSeq,
              transactionType: transactionType == '' ? 'ADJUSTMENT' : transactionType,
              productId: newRecord.product ? newRecord.product.id : inventory.product.id,
              warehouseId: newRecord.warehouse ? newRecord.warehouse.id : inventory.warehouse.id,
              locationId:
                newRecord.location && newRecord.location.id != inventory.location.id
                  ? newRecord.location.id
                  : inventory.location.id,
              inventory: inventory
            }
            delete inventoryHistory.id
            await trxMgr.getRepository(InventoryHistory).save(inventoryHistory)

            if (newRecord.qty != null && newRecord.qty == 0) {
              ++lastSeq
              delete inventoryHistory.id
              inventoryHistory = {
                ...inventoryHistory,
                name: InventoryNoGenerator.inventoryHistoryName(),
                qty: 0,
                uomValue: 0,
                openingQty: 0,
                openingUomValue: 0,
                seq: lastSeq,
                transactionType: 'TERMINATED',
                status: 'TERMINATED',
                inventory: inventory
              }

              await trxMgr.getRepository(InventoryHistory).save(inventoryHistory)
            }

            clean(newRecord)
            await trxMgr.getRepository(Inventory).save({
              ...inventory,
              ...newRecord,
              id: inventoryId,
              status: (newRecord.qty != null ? newRecord.qty : inventory.qty) > 0 ? 'STORED' : 'TERMINATED',
              updater: context.state.user,
              lastSeq: lastSeq
            })

            //Check and set latest location status
            if (newRecord.qty != null ? newRecord.qty : inventory.qty > 0) {
              var location = await trxMgr.getRepository(Location).findOne({
                where: { id: newRecord.location ? newRecord.location.id : inventory.location.id }
              })
              await trxMgr.getRepository(Location).save({
                ...location,
                status: LOCATION_STATUS.OCCUPIED
              })
            } else {
              let latestLocationInventoryCount = await trxMgr.getRepository(Inventory).count({
                where: {
                  location: newRecord.location ? newRecord.location.id : inventory.location.id,
                  status: 'STORED',
                  id: Not(inventory.id)
                }
              })
              if (latestLocationInventoryCount == 0) {
                let latestLocation = await trxMgr.getRepository(Location).findOne({
                  where: { id: newRecord.location ? newRecord.location.id : inventory.location.id }
                })
                await trxMgr.getRepository(Location).save({
                  ...latestLocation,
                  status: LOCATION_STATUS.EMPTY
                })
              }
            }
          }

          // Adding Inventory
          else {
            const total = await trxMgr.getRepository(Inventory).count({
              createdAt: MoreThan(new Date(year, month, date))
            })

            const yy = String(year).substr(String(year).length - 2)
            const mm = String(month + 1).padStart(2, '0')
            const dd = String(date).padStart(2, '0')

            const dateStr = yy + mm + dd

            let palletId = await generateId({
              domain: context.state.domain,
              type: 'pallet_id',
              seed: {
                batchId: newRecord.batchId,
                date: dateStr
              }
            })

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
              locationId: newRecord.location.id,
              inventory: savedInventory
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

      return { items: arrLockedInventory, total: arrLockedInventory.length }
    })
  }
}

function clean(obj) {
  var propNames = Object.getOwnPropertyNames(obj)
  for (var i = 0; i < propNames.length; i++) {
    var propName = propNames[i]
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName]
    }
  }
}

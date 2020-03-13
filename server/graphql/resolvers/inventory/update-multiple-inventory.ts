import { Bizplace } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'
import { getManager, MoreThan } from 'typeorm'
import { Inventory, InventoryHistory, Location } from '../../../entities'
import { InventoryNoGenerator } from '../../../utils'
import { INVENTORY_STATUS } from '../../../constants'

export const updateMultipleInventory = {
  async updateMultipleInventory(_: any, { patches }, context: any) {
    return await getManager().transaction(async trxMgr => {
      let results = []
      const _createRecords = patches.filter((patch: any) => !patch.id)
      const _updateRecords = patches.filter((patch: any) => patch.id)

      const inventoryRepo = trxMgr.getRepository(Inventory)
      if (_createRecords.length > 0) {
        let today = new Date()
        let year = today.getFullYear()
        let month = today.getMonth()
        let date = today.getDate()

        for (let i = 0; i < _createRecords.length; i++) {
          const total = await trxMgr.getRepository(Inventory).count({
            createdAt: MoreThan(new Date(year, month, date))
          })

          const newRecord = _createRecords[i]

          if (newRecord.location && newRecord.location.id) {
            var location = await trxMgr.getRepository(Location).findOne({
              where: { id: newRecord.location.id },
              relations: ['warehouse']
            })
            newRecord.location = location
            newRecord.zone = location.zone
            newRecord.warehouse = location.warehouse
          }

          if (newRecord.bizplace && newRecord.bizplace.id) {
            newRecord.bizplace = await trxMgr.getRepository(Bizplace).findOne(newRecord.bizplace.id)
          }

          if (newRecord.product && newRecord.product.id) {
            var product = await trxMgr.getRepository(Product).findOne(newRecord.product.id)
            newRecord.product = product
          }

          let palletId =
            'P' +
            year.toString().substr(year.toString().length - 2) +
            ('0' + (month + 1).toString()).substr(('0' + (month + 1).toString()).toString().length - 2) +
            ('0' + date.toString()).substr(('0' + date.toString()).length - 2) +
            ('0000' + (total + 1).toString()).substr(('0000' + (total + 1).toString()).length - 4)

          newRecord.name = palletId
          newRecord.status = newRecord.qty < 1 ? 'TERMINATED' : 'STORED'
          newRecord.palletId = palletId

          const result = await inventoryRepo.save({
            domain: context.state.domain,
            creator: context.state.user,
            updater: context.state.user,
            lastSeq: 0,
            ...newRecord
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

          results.push({ ...result, cuFlag: '+' })
        }
      }

      if (_updateRecords.length > 0) {
        for (let i = 0; i < _updateRecords.length; i++) {
          const newRecord = _updateRecords[i]
          const newHistoryRecord = JSON.parse(JSON.stringify(_updateRecords[i]))
          let transactionType = ''

          let inventory = await inventoryRepo.findOne({
            where: { id: newRecord.id },
            relations: ['warehouse', 'location', 'product', 'bizplace']
          })
          newHistoryRecord.openingQty = inventory.qty
          newHistoryRecord.openingWeight = inventory.weight

          // Get last sequence from InventoryHistory
          let latestEntry = await trxMgr.getRepository(InventoryHistory).find({
            where: { palletId: inventory.palletId },
            order: { seq: 'DESC' },
            take: 1
          })
          let lastSeq = latestEntry[0].seq

          // Condition 1: Change location (RELOCATE)
          if (newRecord.location && newRecord.location.id) {
            var location = await trxMgr.getRepository(Location).findOne({
              where: { id: newRecord.location.id },
              relations: ['warehouse']
            })
            newRecord.location = location
            newRecord.zone = location.zone
            newRecord.warehouse = location.warehouse

            newHistoryRecord.location = location
            newHistoryRecord.zone = location.zone
            newHistoryRecord.warehouse = location.warehouse

            transactionType = 'RELOCATE'
          }

          // Condition 2: Change of qty or weight.
          // Set qty movement for inventory history
          if (typeof newRecord.qty != 'undefined') {
            transactionType = 'ADJUSTMENT'
            newHistoryRecord.qty = newRecord.qty - inventory.qty
            if (newRecord.qty < 1) {
              newRecord.status = 'TERMINATED'
              newRecord.qty = 0
              newRecord.weight = 0
            }
          } else {
            newHistoryRecord.qty = 0
          }
          // Set weight movement for inventory history
          if (typeof newRecord.weight != 'undefined') {
            transactionType = 'ADJUSTMENT'
            newHistoryRecord.weight = newRecord.weight - inventory.weight
            if (newRecord.weight < 1) {
              newRecord.weight = 0
            }
          } else {
            newHistoryRecord.weight = 0
          }

          // Condition 3: Change of bizplace or product or batch id or packing type
          if (newRecord.bizplace && newRecord.bizplace.id) {
            newRecord.bizplace = await trxMgr.getRepository(Bizplace).findOne(newRecord.bizplace.id)
          }

          if (newRecord.product && newRecord.product.id) {
            newRecord.product = await trxMgr.getRepository(Product).findOne(newRecord.product.id)
          }

          if (
            (newRecord.product && newRecord.product.id) ||
            (newRecord.bizplace && newRecord.bizplace.id) ||
            newRecord.batchId ||
            newRecord.packingType
          ) {
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
          }

          //Transaction type will be RELOCATE if there is only location change. Any other changes will be considered Adjustment.
          lastSeq = lastSeq + 1
          let inventoryHistory = {
            ...inventory,
            ...newHistoryRecord,
            domain: context.state.domain,
            creator: context.state.user,
            updater: context.state.user,
            name: InventoryNoGenerator.inventoryHistoryName(),
            seq: lastSeq,
            transactionType: transactionType == '' ? 'ADJUSTMENT' : transactionType,
            productId: newHistoryRecord.product ? newHistoryRecord.product.id : inventory.product.id,
            warehouseId: newHistoryRecord.warehouse ? newHistoryRecord.warehouse.id : inventory.warehouse.id,
            locationId: newHistoryRecord.location ? newHistoryRecord.location.id : inventory.location.id
          }

          delete inventoryHistory.id
          await trxMgr.getRepository(InventoryHistory).save(inventoryHistory)

          const result = await inventoryRepo.save({
            ...inventory,
            ...newRecord,
            updater: context.state.user,
            lastSeq: lastSeq
          })

          results.push({ ...result, cuFlag: 'M' })
        }
      }

      return results
    })
  }
}

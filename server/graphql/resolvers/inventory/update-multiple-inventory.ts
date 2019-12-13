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
          const [items, total] = await trxMgr.getRepository(Inventory).findAndCount({
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
            lastSeq: 1,
            ...newRecord
          })

          await trxMgr.getRepository(InventoryHistory).save({
            ...newRecord,
            domain: context.state.domain,
            creator: context.state.user,
            updater: context.state.user,
            name: InventoryNoGenerator.inventoryHistoryName(),
            seq: 1,
            transactionType: 'ADJUSTMENT',
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
          let inventory = await inventoryRepo.findOne({
            where: { id: newRecord.id },
            relations: ['warehouse', 'location', 'product', 'bizplace']
          })

          // Condition 1: if new qty is changed to 0, update status to TERMINATED and weight to 0
          if (typeof newRecord.qty != 'undefined' && newRecord.qty < 1) {
            newRecord.status = 'TERMINATED'
            newRecord.weight = 0
          }

          // Condition 2: if user change location, find zone and warehouse data based on location id
          if (newRecord.location && newRecord.location.id) {
            var location = await trxMgr.getRepository(Location).findOne({
              where: { id: newRecord.location.id },
              relations: ['warehouse']
            })
            newRecord.location = location
            newRecord.zone = location.zone
            newRecord.warehouse = location.warehouse
          }

          // Condition 3: if user change from bizplace A to B or product A to B
          const currentBizplace = inventory.bizplace && inventory.bizplace.id
          const currentProduct = inventory.product && inventory.product.id
          const newProduct = (newRecord.product && newRecord.product.id) || ''
          const newBizplace = (newRecord.bizplace && newRecord.bizplace.id) || ''

          let invTransferFlag = false

          if (newBizplace) {
            newRecord.bizplace = await trxMgr.getRepository(Bizplace).findOne(newRecord.bizplace.id)
          }

          if (newProduct) {
            newRecord.product = await trxMgr.getRepository(Product).findOne(newRecord.product.id)
          }

          const result = await inventoryRepo.save({
            ...inventory,
            ...newRecord,
            updater: context.state.user,
            lastSeq: inventory.lastSeq + 1
          })

          if (currentBizplace != newBizplace || currentProduct != newProduct) {
            invTransferFlag = true

            let inventoryHistory = {
              ...inventory,
              domain: context.state.domain,
              bizplace: currentBizplace,
              openingQty: inventory.qty,
              openingWeight: inventory.weight,
              qty: -inventory.qty || 0,
              weight: -inventory.weight || 0,
              name: InventoryNoGenerator.inventoryHistoryName(),
              seq: inventory.lastSeq + 1,
              transactionType: 'ADJUSTMENT',
              status: INVENTORY_STATUS.TERMINATED,
              productId: inventory.product.id,
              warehouseId: inventory.warehouse.id,
              locationId: inventory.location.id,
              creator: context.state.user,
              updater: context.state.user
            }

            delete inventoryHistory.id
            await trxMgr.getRepository(InventoryHistory).save(inventoryHistory)
          }

          if (invTransferFlag) {
            newRecord.qty = typeof newRecord.qty != 'undefined' ? newRecord.qty : inventory.qty
            newRecord.weight = (typeof newRecord.weight != 'undefined' ? newRecord.weight : inventory.weight) || 0
          } else {
            newRecord.qty = typeof newRecord.qty != 'undefined' ? newRecord.qty - inventory.qty : inventory.qty
            newRecord.weight =
              (typeof newRecord.weight != 'undefined' ? newRecord.weight - inventory.weight : inventory.weight) || 0
          }

          let inventoryHistory = {
            ...inventory,
            ...newRecord,
            openingQty: invTransferFlag ? 0 : inventory.qty,
            openingWeight: invTransferFlag ? 0 : inventory.weight,
            domain: context.state.domain,
            creator: context.state.user,
            updater: context.state.user,
            name: InventoryNoGenerator.inventoryHistoryName(),
            seq: inventory.lastSeq + 1,
            transactionType: 'ADJUSTMENT',
            productId: newRecord.product ? newRecord.product.id : inventory.product.id,
            warehouseId: newRecord.warehouse ? newRecord.warehouse.id : inventory.warehouse.id,
            locationId: newRecord.location ? newRecord.location.id : inventory.location.id
          }

          delete inventoryHistory.id
          await trxMgr.getRepository(InventoryHistory).save(inventoryHistory)

          results.push({ ...result, cuFlag: 'M' })
        }
      }

      return results
    })
  }
}

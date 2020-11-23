import { Bizplace } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'
import { getManager } from 'typeorm'
import { Inventory, InventoryChange, Location } from '../../../entities'
import { InventoryNoGenerator } from '../../../utils'

export const submitInventoryChanges = {
  async submitInventoryChanges(_: any, { patches }, context: any) {
    return await getManager().transaction(async trxMgr => {
      let results = []
      const _createRecords = patches.filter((patch: any) => !patch.id)
      const _updateRecords = patches.filter((patch: any) => patch.id)

      const inventoryChangeRepo = trxMgr.getRepository(InventoryChange)
      if (_createRecords.length > 0) {
        for (let i = 0; i < _createRecords.length; i++) {
          const newRecord = _createRecords[i]

          var location = await trxMgr.getRepository(Location).findOne({
            where: { id: newRecord.location.id },
            relations: ['warehouse']
          })
          newRecord.location = location
          newRecord.zone = location.zone
          newRecord.warehouse = location.warehouse

          newRecord.bizplace = await trxMgr.getRepository(Bizplace).findOne(newRecord.bizplace.id)

          var product = await trxMgr.getRepository(Product).findOne(newRecord.product.id)
          newRecord.product = product

          newRecord.status = 'PENDING'
          newRecord.transactionType = 'NEW'

          await inventoryChangeRepo.save({
            ...newRecord,
            id: undefined,
            name: InventoryNoGenerator.inventoryName(),
            domain: context.state.domain,
            creator: context.state.user,
            updater: context.state.user
          })
        }
      }

      if (_updateRecords.length > 0) {
        for (let i = 0; i < _updateRecords.length; i++) {
          const updateRecord = _updateRecords[i]

          let existingRecord = await trxMgr.getRepository(Inventory).findOne({
            where: { id: updateRecord.id },
            relations: ['location', 'warehouse', 'product', 'bizplace']
          })

          if (!!updateRecord?.location?.id) {
            var location = await trxMgr.getRepository(Location).findOne({
              where: { id: updateRecord.location.id },
              relations: ['warehouse']
            })
            updateRecord.location = location
            updateRecord.zone = location.zone
            updateRecord.warehouse = location.warehouse
          }

          if (!!updateRecord?.bizplace?.id)
            updateRecord.bizplace = await trxMgr.getRepository(Bizplace).findOne(updateRecord.bizplace.id)

          if (!!updateRecord?.product?.id)
            updateRecord.product = await trxMgr.getRepository(Product).findOne(updateRecord.product.id)

          updateRecord.status = 'PENDING'
          updateRecord.transactionType = 'CHANGES'

          await inventoryChangeRepo.save({
            palletId: existingRecord.palletId,
            ...updateRecord,
            id: undefined,
            name: InventoryNoGenerator.inventoryName(),
            inventory: existingRecord,
            domain: context.state.domain,
            creator: context.state.user,
            updater: context.state.user
          })
        }
      }

      return true
    })
  }
}

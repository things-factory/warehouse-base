import { getRepository, MoreThan } from 'typeorm'
import { Inventory, Location, InventoryHistory } from '../../../entities'
import { InventoryNoGenerator } from '../../../utils'
import { Bizplace } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'

export const updateMultipleInventory = {
  async updateMultipleInventory(_: any, { patches }, context: any) {
    let results = []
    const _createRecords = patches.filter((patch: any) => !patch.id)
    const _updateRecords = patches.filter((patch: any) => patch.id)

    const inventoryRepo = getRepository(Inventory)
    if (_createRecords.length > 0) {
      let today = new Date()
      let year = today.getFullYear()
      let month = today.getMonth()
      let date = today.getDate()

      for (let i = 0; i < _createRecords.length; i++) {
        const [items, total] = await getRepository(Inventory).findAndCount({
          createdAt: MoreThan(new Date(year, month, date))
        })

        const newRecord = _createRecords[i]

        if (newRecord.location && newRecord.location.id) {
          var location = await getRepository(Location).findOne({
            where: { id: newRecord.location.id },
            relations: ['warehouse']
          })
          newRecord.location = location
          newRecord.zone = location.zone
          newRecord.warehouse = location.warehouse
        }

        if (newRecord.bizplace && newRecord.bizplace.id) {
          newRecord.bizplace = await getRepository(Bizplace).findOne(newRecord.bizplace.id)
        }

        if (newRecord.product && newRecord.product.id) {
          var product = await getRepository(Product).findOne(newRecord.product.id)
          newRecord.product = product
        }

        let palletId =
          'P' +
          year.toString().substr(year.toString().length - 2) +
          ('0' + month.toString()).substr(('0' + month.toString()).toString().length - 2) +
          ('0' + date.toString()).substr(('0' + date.toString()).length - 2) +
          '/' +
          ('0000' + (total + 1).toString()).substr(('0000' + (total + 1).toString()).length - 4)

        newRecord.name = palletId
        newRecord.status = newRecord.qty < 1 ? 'TERMINATED' : 'STORED'
        newRecord.palletId = palletId

        const result = await inventoryRepo.save({
          domain: context.state.domain,
          creator: context.state.user,
          updater: context.state.user,
          ...newRecord
        })

        await getRepository(InventoryHistory).save({
          ...newRecord,
          domain: context.state.domain,
          creator: context.state.user,
          updater: context.state.user,
          name: InventoryNoGenerator.inventoryHistoryName(),
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
          relations: ['warehouse', 'location', 'product']
        })

        if (newRecord.qty && newRecord.qty < 1) {
          newRecord.status = 'TERMINATED'
        }

        if (newRecord.location && newRecord.location.id) {
          var location = await getRepository(Location).findOne({
            where: { id: newRecord.location.id },
            relations: ['warehouse']
          })
          newRecord.location = location
          newRecord.zone = location.zone
          newRecord.warehouse = location.warehouse
        }

        if (newRecord.bizplace && newRecord.bizplace.id) {
          newRecord.bizplace = await getRepository(Bizplace).findOne(newRecord.bizplace.id)
        }

        if (newRecord.product && newRecord.product.id) {
          newRecord.product = await getRepository(Product).findOne(newRecord.product.id)
        }

        const result = await inventoryRepo.save({
          ...inventory,
          ...newRecord,
          updater: context.state.user
        })

        let inventoryHistory = {
          ...inventory,
          ...newRecord,
          domain: context.state.domain,
          creator: context.state.user,
          updater: context.state.user,
          name: InventoryNoGenerator.inventoryHistoryName(),
          transactionType: 'ADJUSTMENT',
          productId: newRecord.product ? newRecord.product.id : inventory.product.id,
          warehouseId: newRecord.warehouse ? newRecord.warehouse.id : inventory.warehouse.id,
          locationId: newRecord.location ? newRecord.location.id : inventory.location.id
        }

        delete inventoryHistory.id
        await getRepository(InventoryHistory).save(inventoryHistory)

        results.push({ ...result, cuFlag: 'M' })
      }
    }

    return results
  }
}

import { getRepository, MoreThan } from 'typeorm'
import { Inventory, Location } from '../../../entities'
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

        newRecord.name = newRecord.batchId || ''
        newRecord.status = 'OCCUPIED'
        newRecord.palletId =
          'P' +
          year.toString().substr(year.toString().length - 2) +
          ('0' + month.toString()).substr(('0' + month.toString()).toString().length - 2) +
          ('0' + date.toString()).substr(('0' + date.toString()).length - 2) +
          '/' +
          ('0000' + (total + 1).toString()).substr(('0000' + (total + 1).toString()).length - 4)

        const result = await inventoryRepo.save({
          domain: context.state.domain,
          creator: context.state.user,
          updater: context.state.user,
          ...newRecord
        })

        results.push({ ...result, cuFlag: '+' })
      }
    }

    if (_updateRecords.length > 0) {
      for (let i = 0; i < _updateRecords.length; i++) {
        const newRecord = _updateRecords[i]
        const inventory = await inventoryRepo.findOne(newRecord.id)

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

        results.push({ ...result, cuFlag: 'M' })
      }
    }

    return results
  }
}

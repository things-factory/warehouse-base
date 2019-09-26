import { getRepository } from 'typeorm'
import { InventoryHistory } from '../../../entities'

export const updateMultipleInventoryHistory = {
  async updateMultipleInventoryHistory(_: any, { patches }, context: any) {
    let results = []
    const _createRecords = patches.filter((patch: any) => patch.cuFlag.toUpperCase() === '+')
    const _updateRecords = patches.filter((patch: any) => patch.cuFlag.toUpperCase() === 'M')
    const inventoryHistoryRepo = getRepository(InventoryHistory)

    if (_createRecords.length > 0) {
      let newRecord = new InventoryHistory()
      for (let i = 0; i < _createRecords.length; i++) {
        newRecord = _createRecords[i]
      }

      const result = await inventoryHistoryRepo.save({
        ...newRecord,
        domain: context.state.domain,
        creator: context.state.user,
        updater: context.state.user
      })

      results.push({ ...result, cuFlag: '+' })
    }

    if (_updateRecords.length > 0) {
      for (let i = 0; i < _updateRecords.length; i++) {
        const newRecord = _updateRecords[i]
        const inventoryHistory = await inventoryHistoryRepo.findOne(newRecord.id)

        const result = await inventoryHistoryRepo.save({
          ...inventoryHistory,
          ...newRecord,
          updater: context.state.user
        })

        results.push({ ...result, cuFlag: 'M' })
      }
    }

    return results
  }
}

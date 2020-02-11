import { getRepository } from 'typeorm'
import { InventoryChange } from '../../../entities'

export const updateMultipleInventoryChange = {
    async updateMultipleInventoryChange(_: any, { patches }, context: any) {
        let results = []
        const _createRecords = patches.filter((patch: any) => patch.cuFlag.toUpperCase() === '+')
        const _updateRecords = patches.filter((patch: any) => patch.cuFlag.toUpperCase() === 'M')
        const inventoryChangeRepo = getRepository(InventoryChange)
    
        if (_createRecords.length > 0) {
            for (let i = 0; i < _createRecords.length; i++) {
              const newRecord = _createRecords[i]
              
              const result = await inventoryChangeRepo.save({
                ...newRecord,
                domain: context.state.domain,
                creator: context.state.user,
                updater: context.state.user,
              })
              
              results.push({ ...result, cuFlag: '+' })
            }
        }

        if (_updateRecords.length > 0) {
            for (let i = 0; i < _updateRecords.length; i++) {
              const newRecord = _updateRecords[i]
              const inventoryChange = await inventoryChangeRepo.findOne(newRecord.id)
      
              const result = await inventoryChangeRepo.save({
                ...inventoryChange,
                ...newRecord,
                updater: context.state.user
              })
      
              results.push({ ...result, cuFlag: 'M' })
            }
        }
      
        return results
    }
}


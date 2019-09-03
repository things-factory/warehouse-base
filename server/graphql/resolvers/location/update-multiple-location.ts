import { getRepository } from 'typeorm'
import { Location, Warehouse } from '../../../entities'

export const updateMultipleLocation = {
  async updateMultipleLocation(_: any, { patches }, context: any) {
    let results = []
    const _createRecords = patches.filter((patch: any) => patch.cuFlag.toUpperCase() === '+')
    const _updateRecords = patches.filter((patch: any) => patch.cuFlag.toUpperCase() === 'M')
    const locationRepo = getRepository(Location)
    const warehouseRepo = getRepository(Warehouse)

    if (_createRecords.length > 0) {
      for (let i = 0; i < _createRecords.length; i++) {
        const newRecord = _createRecords[i]

        if (newRecord.warehouse && newRecord.warehouse.id) {
          newRecord.warehouse = await warehouseRepo.findOne(newRecord.warehouse.id)
        }

        const result = await locationRepo.save({
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
        const location = await locationRepo.findOne(newRecord.id)

        if (newRecord.warehouse && newRecord.warehouse.id) {
          newRecord.warehouse = await warehouseRepo.findOne(newRecord.warehouse.id)
        }

        const result = await locationRepo.save({
          ...location,
          ...newRecord,
          updater: context.state.user
        })

        results.push({ ...result, cuFlag: 'M' })
      }
    }

    return results
  }
}

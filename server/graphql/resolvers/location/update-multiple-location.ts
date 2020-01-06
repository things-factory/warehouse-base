import { EntityManager, getManager } from 'typeorm'
import { Location } from '../../../entities'
import { createLocation } from './create-location'
import { updateLocation } from './update-location'

export const updateMultipleLocation = {
  async updateMultipleLocation(_: any, { patches }, context: any) {
    return await getManager().transaction(async (trxMgr: EntityManager) => {
      let results = []
      const _createRecords = patches.filter((patch: any) => patch.cuFlag === '+')
      const _updateRecords = patches.filter((patch: any) => patch.cuFlag.toUpperCase() === 'M')

      if (_createRecords.length > 0) {
        for (let i = 0; i < _createRecords.length; i++) {
          const patch: Location = _createRecords[i]
          const result = await createLocation(patch, context.state.domain, context.state.user, trxMgr)
          results.push({ ...result, cuFlag: '+' })
        }
      }

      if (_updateRecords.length > 0) {
        for (let i = 0; i < _updateRecords.length; i++) {
          const patch: Location = _updateRecords[i]
          const result = await updateLocation(patch.id, patch, context.state.user, trxMgr)
          results.push({ ...result, cuFlag: 'M' })
        }
      }

      return results
    })
  }
}

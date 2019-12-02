import { EntityManager, getManager } from 'typeorm'
import { Warehouse } from '../../../entities'
import { createWarehouse } from './create-warehouse'
import { updateWarehouse } from './update-warehouse'

export const updateMultipleWarehouse = {
  async updateMultipleWarehouse(_: any, { patches }, context: any): Promise<any> {
    return await getManager().transaction(async (trxMgr: EntityManager) => {
      let results = []
      const _createRecords = patches.filter((patch: any) => patch.cuFlag === '+')
      const _updateRecords = patches.filter((patch: any) => patch.cuFlag.toUpperCase() === 'M')

      if (_createRecords.length > 0) {
        for (let i = 0; i < _createRecords.length; i++) {
          const patch: Warehouse = _createRecords[i]
          const result = await createWarehouse(patch, context.state.domain, context.state.user, trxMgr)
          results.push({ ...result, cuFlag: '+' })
        }
      }

      if (_updateRecords.length > 0) {
        for (let i = 0; i < _updateRecords.length; i++) {
          const patch: Warehouse = _updateRecords[i]
          const result = await updateWarehouse(patch.id, patch, context.state.user)
          results.push({ ...result, cuFlag: 'M' })
        }
      }

      return results
    })
  }
}

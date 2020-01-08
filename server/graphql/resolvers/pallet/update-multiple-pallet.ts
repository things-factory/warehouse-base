import { getManager, getRepository } from 'typeorm'
import { Pallet } from '../../../entities'
import { Bizplace } from '@things-factory/biz-base'

export const updateMultiplePallet = {
  async updateMultiplePallet(_: any, { patches }, context: any) {
    return await getManager().transaction(async trxMgr => {
      let results = []
      const _createRecords = patches.filter((patch: any) => patch.cuFlag.toUpperCase() === '+')
      const _updateRecords = patches.filter((patch: any) => patch.cuFlag.toUpperCase() === 'M')
      const palletRepo = getRepository(Pallet)
      const bizplaceRepo = getRepository(Bizplace)

      if (_createRecords.length > 0) {
        for (let i = 0; i < _createRecords.length; i++) {
          const newRecord = _createRecords[i]

          if (newRecord.owner && newRecord.owner.id) {
            newRecord.owner = await trxMgr.getRepository(Bizplace).findOne(newRecord.owner.id)
          }

          if (newRecord.holder && newRecord.holder.id) {
            newRecord.holder = await trxMgr.getRepository(Bizplace).findOne(newRecord.holder.id)
          }

          const result = await palletRepo.save({
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
          const pallet = await palletRepo.findOne(newRecord.id)

          if (newRecord.owner && newRecord.owner.id) {
            newRecord.owner = await trxMgr.getRepository(Bizplace).findOne(newRecord.owner.id)
          }

          if (newRecord.holder && newRecord.holder.id) {
            newRecord.holder = await trxMgr.getRepository(Bizplace).findOne(newRecord.holder.id)
          }

          const result = await palletRepo.save({
            ...pallet,
            ...newRecord,
            updater: context.state.user
          })

          results.push({ ...result, cuFlag: 'M' })
        }
      }

      return results
    })
  }
}

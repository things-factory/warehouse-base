import { getManager, getRepository } from 'typeorm'
import { Pallet, PalletHistory } from '../../../entities'
import { Bizplace } from '@things-factory/biz-base'

export const updateMultiplePallet = {
  async updateMultiplePallet(_: any, { patches }, context: any) {
    return await getManager().transaction(async trxMgr => {
      let results = []
      const _createRecords = patches.filter((patch: any) => patch.cuFlag.toUpperCase() === '+')
      const _updateRecords = patches.filter((patch: any) => patch.cuFlag.toUpperCase() === 'M')

      if (_createRecords.length > 0) {
        for (let i = 0; i < _createRecords.length; i++) {
          const newRecord = _createRecords[i]

          if (newRecord.owner && newRecord.owner.id) {
            newRecord.owner = await trxMgr.getRepository(Bizplace).findOne(newRecord.owner.id)
          }

          if (newRecord.holder && newRecord.holder.id) {
            newRecord.holder = await trxMgr.getRepository(Bizplace).findOne(newRecord.holder.id)
          }

          const result: Pallet = await trxMgr.getRepository(Pallet).save({
            domain: context.state.domain,
            creator: context.state.user,
            updater: context.state.user,
            ...newRecord
          })

          await trxMgr.getRepository(PalletHistory).save({
            ...newRecord,
            pallet: result,
            domain: context.state.domain,
            creator: context.state.user,
            updater: context.state.user,
            transactionType: 'NEW'
          })

          results.push({ ...result, cuFlag: '+' })
        }
      }

      if (_updateRecords.length > 0) {
        for (let i = 0; i < _updateRecords.length; i++) {
          const newRecord = _updateRecords[i]
          const pallet = await getRepository(Pallet).findOne({
            where: { id: newRecord.id },
            relations: ['owner', 'holder']
          })
          const seq = pallet.seq + 1

          if (newRecord.owner && newRecord.owner.id) {
            newRecord.owner = await trxMgr.getRepository(Bizplace).findOne(newRecord.owner.id)
          }

          if (newRecord.holder && newRecord.holder.id) {
            newRecord.holder = await trxMgr.getRepository(Bizplace).findOne(newRecord.holder.id)
          }

          const result = await trxMgr.getRepository(Pallet).save({
            ...pallet,
            ...newRecord,
            seq,
            updater: context.state.user
          })

          delete newRecord.id

          let newHistory = {
            ...pallet,
            ...newRecord,
            pallet: result,
            seq,
            domain: context.state.domain,
            creator: context.state.user,
            updater: context.state.user,
            transactionType: 'UPDATE'
          }

          await trxMgr.getRepository(PalletHistory).save({
            ...newHistory
          })

          results.push({ ...result, cuFlag: 'M' })
        }
      }

      return results
    })
  }
}

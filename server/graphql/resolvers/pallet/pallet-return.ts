import { getManager, getRepository } from 'typeorm'
import { Pallet, PalletHistory } from '../../../entities'
import { Bizplace } from '@things-factory/biz-base'

export const palletReturn = {
  async palletReturn(_: any, { patches }, context: any) {
    return await getManager().transaction(async trxMgr => {
      let results = []
      const _updateRecords = patches

      if (_updateRecords.length > 0) {
        for (let i = 0; i < _updateRecords.length; i++) {
          const newRecord = _updateRecords[i]
          const pallet = await getRepository(Pallet).findOne({
            where: { id: newRecord.id },
            relations: ['owner', 'holder']
          })
          const seq = pallet.seq + 1

          newRecord.owner = await trxMgr.getRepository(Bizplace).findOne(newRecord.owner.id)
          newRecord.holder = newRecord.owner

          const result = await trxMgr.getRepository(Pallet).save({
            ...pallet,
            ...newRecord,
            seq,
            updater: context.state.user,
            refOrderNo: null
          })

          let newHistory = {
            ...pallet,
            ...newRecord,
            pallet: result,
            seq,
            domain: context.state.domain,
            creator: context.state.user,
            updater: context.state.user,
            transactionType: 'RETURN'
          }

          delete newHistory.id

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

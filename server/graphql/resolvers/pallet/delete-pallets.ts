import { getRepository, In, getManager } from 'typeorm'
import { Pallet, PalletHistory } from '../../../entities'

export const deletePallets = {
  async deletePallets(_: any, { id }, context: any) {
    return await getManager().transaction(async trxMgr => {
      const pallets = await getRepository(Pallet).find({
        where: {
          domain: context.state.domain,
          id: In(id)
        },
        relations: ['owner', 'holder']
      })

      await Promise.all(
        pallets.map(async (pallet: Pallet) => {
          let seq = pallet.seq + 1
          await trxMgr.getRepository(Pallet).save({
            ...pallet,
            status: 'TERMINATED',
            seq,
            updater: context.state.user
          })

          await trxMgr.getRepository(PalletHistory).save({
            pallet: pallet,
            name: pallet.name,
            owner: pallet.owner,
            holder: pallet.holder,
            seq,
            domain: context.state.domain,
            creator: context.state.user,
            updater: context.state.user,
            status: 'TERMINATED',
            transactionType: 'UPDATE'
          })
        })
      )
      return true
    })
  }
}

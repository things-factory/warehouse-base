import { getRepository,MoreThan } from 'typeorm'
import { PalletCount } from '../../../entities'
import uuid from 'uuid/v4'

export const updatePalletCountSeq = {
  async updatePalletCountSeq(_: any, { printQty }, context: any) {
    const repository = getRepository(PalletCount)
    const todayDate = new Date()
    todayDate.setHours(0,0,0,0);
    const palletCount = await repository.findOne({ 
      where: { domain: context.state.domain, createdAt: MoreThan(todayDate) }
    })

    if(!palletCount){
      let newPallet = {
        name: uuid(),
        seq: 0,
        domain: context.state.domain,
        creator: context.state.user,
        updater: context.state.user
      }

      await getRepository(PalletCount).save({
        ...newPallet,
        seq: printQty
      })

      return {
        newPallet
      }
    }else{
      await getRepository(PalletCount).save({
        ...palletCount,
        seq: printQty + palletCount.seq
      })

      return palletCount
    }

  }
}
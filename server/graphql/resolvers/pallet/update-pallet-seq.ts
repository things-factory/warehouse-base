import { getRepository,MoreThan } from 'typeorm'
import { Pallet } from '../../../entities'
import uuid from 'uuid/v4'

export const updatePalletSeq = {
  async updatePalletSeq(_: any, { printQty }, context: any) {
    const repository = getRepository(Pallet)
    const todayDate = new Date()
    todayDate.setHours(0,0,0,0);
    const pallet = await repository.findOne({ 
      where: { domain: context.state.domain, createdAt: MoreThan(todayDate) }
    })

    if(!pallet){
      let newPallet = {
        name: uuid(),
        seq: 0,
        domain: context.state.domain,
        creator: context.state.user,
        updater: context.state.user
      }

      await getRepository(Pallet).save({
        ...newPallet,
        seq: printQty
      })

      return {
        newPallet
      }
    }else{
      await getRepository(Pallet).save({
        ...pallet,
        seq: printQty + pallet.seq
      })

      return pallet
    }

  }
}
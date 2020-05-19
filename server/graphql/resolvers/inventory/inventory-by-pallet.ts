import { Equal, getRepository, Not } from 'typeorm'
import { INVENTORY_STATUS } from '../../../constants'
import { Inventory } from '../../../entities'

export const inventoryByPalletResolver = {
  async inventoryByPallet(_: any, { palletId }, context: any) {
    return await getRepository(Inventory).findOne({
      where: { domain: context.state.domain, palletId, status: Not(Equal(INVENTORY_STATUS.TERMINATED)) },
      relations: ['domain', 'bizplace', 'product', 'location', 'warehouse', 'creator', 'updater']
    })
  }
}

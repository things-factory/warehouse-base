import { ListParam } from '@things-factory/shell'
import { getManager, In } from 'typeorm'
import { Location, Inventory } from '../../../entities'
import { generateInventoryHistory } from '../../../utils'
import { INVENTORY_TRANSACTION_TYPE } from '../../../constants'

export const inventoryTransfer = {
  async inventoryTransfer(_: any, { palletId, fromLocation, toLocation }, context: any) {
    try {
      return await getManager().transaction(async trxMgr => {
        // 1. check toLocation exist
        const location: Location = await trxMgr.getRepository(Location).findOne({
          where: {
            domain: context.state.domain,
            name: toLocation
          },
          relations: ['warehouse']
        })
        if (!location) throw new Error(`Location doesn't exists`)

        // 2. search for related inventory
        const foundInventory: Inventory = await trxMgr.getRepository(Inventory).findOne({
          where: { domain: context.state.domain, palletId },
          relations: ['location']
        })

        if (!foundInventory) throw new Error('Pallet Id not found')

        const locationId = await trxMgr.getRepository(Location).findOne({
          where: { domain: context.state.domain, name: toLocation }
        })

        const inventory: Inventory = await trxMgr.getRepository(Inventory).save({
          ...foundInventory,
          location: locationId,
          updater: context.state.user
        })

        // Generate inventory history
        await generateInventoryHistory(
          inventory,
          null,
          INVENTORY_TRANSACTION_TYPE.RELOCATE,
          0,
          0,
          context.state.user,
          trxMgr
        )
      })
    } catch (error) {
      throw error
    }
  }
}

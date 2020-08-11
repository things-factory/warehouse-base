import { ListParam } from '@things-factory/shell'
import { getManager, In } from 'typeorm'
import { Location, Inventory, Warehouse } from '../../../entities'
import { generateInventoryHistory, switchLocationStatus } from '../../../utils'
import { INVENTORY_TRANSACTION_TYPE } from '../../../constants'

export const inventoryTransfer = {
  async inventoryTransfer(_: any, { palletId, fromLocationName, toLocationName }, context: any) {
    try {
      return await getManager().transaction(async trxMgr => {
        // 1. check toLocation exist
        const toLocation = await trxMgr.getRepository(Location).findOne({
          where: { domain: context.state.domain, name: toLocationName },
          relations: ['domain', 'warehouse']
        })
        if (!toLocation) throw new Error(`Location doesn't exists`)

        // 2. search for related inventory
        const foundInventory: Inventory = await trxMgr.getRepository(Inventory).findOne({
          where: { domain: context.state.domain, palletId },
          relations: ['location']
        })

        if (!foundInventory) throw new Error('Pallet Id not found')

        const fromLocation = await trxMgr.getRepository(Location).findOne({
          where: { domain: context.state.domain, name: fromLocationName },
          relations: ['domain', 'warehouse']
        })

        const inventory: Inventory = await trxMgr.getRepository(Inventory).save({
          ...foundInventory,
          warehouse: toLocation.warehouse,
          location: toLocation,
          zone: toLocation.zone,
          updater: context.state.user
        })

        //Update fromLocation status
        await switchLocationStatus(context.state.domain, fromLocation, context.state.user, trxMgr)

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

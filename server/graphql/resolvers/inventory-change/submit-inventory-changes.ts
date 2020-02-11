import { Bizplace } from '@things-factory/biz-base'
import { Product } from '@things-factory/product-base'
import { getManager, MoreThan } from 'typeorm'
import { Inventory, InventoryHistory, Location } from '../../../entities'
import { InventoryNoGenerator } from '../../../utils'
import { INVENTORY_STATUS } from '../../../constants'

export const submitInventoryChanges = {
  async submitInventoryChanges(_: any, { patches }, context: any) {
    return await getManager().transaction(async trxMgr => {
      return patches
    })
  }
}

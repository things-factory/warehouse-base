import { getRepository, Repository } from 'typeorm'
import { Inventory } from '../../../entities'
import { Bizplace } from '@things-factory/biz-base'
import { INVENTORY_STATUS } from '../../../constants'

export const checkInventoryOwnerResolver = {
  async checkInventoryOwner(_: any, { palletId, bizplaceName }, context: any) {
    const invRepo: Repository<Inventory> = getRepository(Inventory)
    const bizRepo: Repository<Bizplace> = getRepository(Bizplace)

    const inventory: Inventory = await invRepo.findOne({
      where: { domain: context.state.domain, palletId, status: INVENTORY_STATUS.STORED },
      relations: ['bizplace']
    })

    if (!inventory) throw new Error('This inventory has been terminated in the system.')

    const ownerBizplace: Bizplace = await bizRepo.findOne({
      where: { name: bizplaceName }
    })

    const foundBizplace: Bizplace = inventory.bizplace

    return (ownerBizplace === foundBizplace)
  }
}

import { getRepository, Repository } from 'typeorm'
import { Inventory } from '../../../entities'
import { INVENTORY_STATUS } from 'server/constants'

export const checkProductIdenticalityResolver = {
  async checkProductIdenticality(_: any, { palletA, palletB }, context: any) {
    const invRepo: Repository<Inventory> = getRepository(Inventory)
    const invA: Inventory = await invRepo.findOne({
      where: { domain: context.state.domain, palletId: palletA, status: INVENTORY_STATUS.STORED },
      relations: ['product']
    })

    const invB: Inventory = await invRepo.findOne({
      where: { domain: context.state.domain, palletId: palletB, status: INVENTORY_STATUS.STORED },
      relations: ['product']
    })

    return (
      invA?.batchId === invB?.batchId &&
      invA?.product?.id &&
      invB?.product?.id &&
      invA?.packingType === invB?.packingType
    )
  }
}

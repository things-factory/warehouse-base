import { getRepository, In } from 'typeorm'
import { PickingBin } from '../../../entities'

export const deletePickingBins = {
  async deletePickingBins(_: any, { ids }, context: any) {
    await getRepository(PickingBin).delete({ 
        domain: context.state.domain,
        id: In(ids)
    })
    return true
  }
}


import { getRepository } from 'typeorm'
import { PickingBin } from '../../../entities'

export const deletePickingBin = {
  async deletePickingBin(_: any, { name }, context: any) {
    await getRepository(PickingBin).delete({ domain: context.state.domain, name })
    return true
  }
}


import { getRepository } from 'typeorm'
import { PalletCount } from '../../../entities'

export const deletePalletCount = {
  async deletePalletCount(_: any, { name }, context: any) {
    await getRepository(PalletCount).delete({ domain: context.state.domain, name })
    return true
  }
}


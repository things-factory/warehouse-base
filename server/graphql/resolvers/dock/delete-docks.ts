import { getRepository, In } from 'typeorm'
import { Dock } from '../../../entities'

export const deleteDocks = {
  async deleteDocks(_: any, { names }, context: any) {
    await getRepository(Dock).delete({ 
        domain: context.state.domain,
        name: In(names)
    })
    return true
  }
}


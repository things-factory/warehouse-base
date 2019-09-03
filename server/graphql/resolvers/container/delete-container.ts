import { getRepository } from 'typeorm'
import { Container } from '../../../entities'

export const deleteContainer = {
  async deleteContainer(_: any, { name }, context: any) {
    return await getRepository(Container).delete({ domain: context.state.domain, name })
  }
}

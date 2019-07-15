import uuid from 'uuid/v4'

import { getRepository } from 'typeorm'
import { Warehouse } from '../../../entities'

export const createWarehouse = {
  async createWarehouse(_: any, { warehouse }, context: any) {
    return await getRepository(Warehouse).save({
      domain: context.domain,
      creatorId: context.state.user.id,
      updaterId: context.state.user.id,
      ...warehouse
    })
  }
}

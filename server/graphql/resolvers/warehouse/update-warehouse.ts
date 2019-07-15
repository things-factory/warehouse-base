import { getRepository } from 'typeorm'
import { Warehouse } from '../../../entities'

export const updateWarehouse = {
  async updateWarehouse(_: any, { name, patch }, context: any) {
    const repository = getRepository(Warehouse)

    const warehouse = await repository.findOne({ where: { domain: context.domain, name } })

    return await repository.save({
      ...warehouse,
      ...patch,
      updaterId: context.state.user.id
    })
  }
}

import { getRepository, In } from 'typeorm'
import { Warehouse, Location } from '../../../entities'

export const deleteWarehouse = {
  async deleteWarehouse(_: any, { name }, context: any) {
    let foundWarehouse: Warehouse = await getRepository(Warehouse).findOne({
      where: { domain: context.state.domain, name },
      relations: ['domain', 'bizplace', 'creator', 'updater']
    })
    if (!foundWarehouse) throw new Error(`Warehouse doesn't exists.`)
    const foundLocations: Location[] = foundWarehouse.locations

    if (foundLocations) {
      const locIds = foundLocations.map((loc: Location) => loc.id)
      if (locIds.length) {
        await getRepository(Location).delete({ id: In(locIds) })
      }
    }

    await getRepository(Warehouse).delete({ domain: context.state.domain, name })
    return true
  }
}

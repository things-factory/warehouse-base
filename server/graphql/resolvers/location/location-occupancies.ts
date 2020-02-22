import { getRepository } from 'typeorm'
import { Location, Warehouse } from '../../../entities'

export const locationOccupanciesResolver = {
  async locationOccupancies(_: any, { warehouse }, context: any) {

    var where = { 
      domain: context.state.domain,
      type: 'SHELF'
    }

    if (warehouse !== '') {
      const foundWarehouse = await getRepository(Warehouse).findOne({
        where: {
          domain: context.state.domain,
          name: warehouse
        }
      })

      if (foundWarehouse)
        where['warehouse'] = foundWarehouse.id
      else throw new Error(`${warehouse} was not found!`)
    }

    const locations = await getRepository(Location).find({
      where,
      relations: ['domain', 'warehouse', 'creator', 'updater']
    })
    
    let occupied = 0
    locations.forEach(location => {
      if (location.status === 'OCCUPIED')
        occupied += 1
    })

    const total = locations.length

    const empty = total - occupied
    const percentage = Math.round(occupied / total * 100)

    return { total, occupied, empty, percentage }
  }
}

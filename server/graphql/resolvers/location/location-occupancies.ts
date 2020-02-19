import { getRepository } from 'typeorm'
import { convertListParams, ListParam } from '@things-factory/shell'
import { Location } from '../../../entities'

export const locationOccupanciesResolver = {
  async locationOccupancies(_: any, { warehouse }, context: any) {

    var where = { 
      domain: context.state.domain,
      type: 'SHELF'
    }

    if (warehouse !== '') {
      where['warehouse'] = warehouse
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

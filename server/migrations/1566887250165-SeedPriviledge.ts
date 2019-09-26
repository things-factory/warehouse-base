import { MigrationInterface, QueryRunner, getRepository } from 'typeorm'
import { Priviledge } from '@things-factory/auth-base'
import { Domain } from '@things-factory/shell'

const SEEDS_PRIVILEDGES = [
  {
    name: 'query',
    category: 'movement',
    description: 'to read movement data'
  },
  {
    name: 'mutation',
    category: 'movement',
    description: 'to edit movement data'
  },
  {
    name: 'query',
    category: 'warehouse',
    description: 'to read warehouse data'
  },
  {
    name: 'mutation',
    category: 'warehouse',
    description: 'to edit warehouse data'
  },
  {
    name: 'query',
    category: 'inventory',
    description: 'to read inventory data'
  },
  {
    name: 'mutation',
    category: 'inventory',
    description: 'to edit inventory data'
  }
]

export class SeedPriviledge1566887250165 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const domains = await getRepository(Domain).find()

    try {
      for (let i = 0; i < domains.length; i++) {
        const domain = domains[i]

        for (let j = 0; j < SEEDS_PRIVILEDGES.length; j++) {
          const priviledge: any = SEEDS_PRIVILEDGES[j]
          priviledge.domain = domain

          await getRepository(Priviledge).save({
            ...priviledge
          })
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Priviledge)

    SEEDS_PRIVILEDGES.reverse().forEach(async priviledge => {
      let record = await repository.findOne({ name: priviledge.name })
      await repository.remove(record)
    })
  }
}

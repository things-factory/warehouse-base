import { MigrationInterface, QueryRunner, getRepository } from 'typeorm'
import { Priviledge } from '@things-factory/auth-base'
import { Domain } from '@things-factory/shell'

const SEEDS_PRIVILEDGE = [
  {
    name: 'query',
    category: 'warehouse',
    description: 'to read warehouse data'
  },
  {
    name: 'mutation',
    category: 'warehouse',
    description: 'to edit warehouse data'
  }
]

export class SeedPriviledge1566887250165 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Priviledge)
    const domain = await getRepository(Domain).findOne({ where: { name: 'SYSTEM' } })

    try {
      for (let i = 0; i < SEEDS_PRIVILEDGE.length; i++) {
        const priviledge = SEEDS_PRIVILEDGE[i]
        await repository.save({
          domain,
          ...priviledge
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Priviledge)

    SEEDS_PRIVILEDGE.reverse().forEach(async priviledge => {
      let record = await repository.findOne({ name: priviledge.name })
      await repository.remove(record)
    })
  }
}

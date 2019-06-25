import { MigrationInterface, QueryRunner, getRepository } from 'typeorm'
import { Domain } from '@things-factory/shell'
import { Container } from '../entities'

const SEED = [
  {
    name: 'Seed',
    description: 'Description for Seed'
  }
]

export class SeedContainer1561445817368 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Container)
    const domainRepository = getRepository(Domain)
    const domain = await domainRepository.findOne({
      name: 'SYSTEM'
    })

    try {
      SEED.forEach(async container => {
        await repository.save({
          ...container,
          domain
        })
      })
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(Container)
    SEED.reverse().forEach(async container => {
      let record = await repository.findOne({ name: container.name })
      await repository.remove(record)
    })
  }
}

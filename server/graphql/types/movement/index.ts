import { Movement } from './movement'
import { MovementList } from './movement-list'
import { MovementPatch } from './movement-patch'
import { NewMovement } from './new-movement'
import { directivePriviledge } from '@things-factory/auth-base'
import { MovementCount } from './movement-count'

export const Mutation = `
  createMovement (
    movement: NewMovement!
  ): Movement @priviledge(category: "movement", priviledge: "mutation")

  updateMovement (
    id: String!
    patch: MovementPatch!
  ): Movement @priviledge(category: "movement", priviledge: "mutation")

  deleteMovement (
    name: String!
  ): Boolean @priviledge(category: "movement", priviledge: "mutation")
`

export const Query = `
  movements(filters: [Filter], pagination: Pagination, sortings: [Sorting]): MovementList @priviledge(category: "movement", priviledge: "query")
  movement(id: String!): Movement @priviledge(category: "movement", priviledge: "query")
  inboundMovementsCounter(filters: [Filter]): [MovementCount]
  outboundMovementsCounter(filters: [Filter]): [MovementCount]
  weeklyMovementsCounter(month: Int, year: Int): [MovementCount]
`

export const Types = [Movement, NewMovement, MovementPatch, MovementList, MovementCount]

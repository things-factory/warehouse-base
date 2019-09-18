import { Movement } from './movement'
import { MovementList } from './movement-list'
import { MovementPatch } from './movement-patch'
import { NewMovement } from './new-movement'
import { directivePriviledge } from '@things-factory/auth-base'

export const Mutation = `
  createMovement (
    movement: NewMovement!
  ): Movement @priviledge(category: "movement", priviledge: "mutation")

  updateMovement (
    name: String!
    patch: MovementPatch!
  ): Movement @priviledge(category: "movement", priviledge: "mutation")

  deleteMovement (
    name: String!
  ): Boolean @priviledge(category: "movement", priviledge: "mutation")
    `

export const Query = `
  movements(filters: [Filter], pagination: Pagination, sortings: [Sorting]): MovementList @priviledge(category: "movement", priviledge: "query")
  movement(id: String!): Movement @priviledge(category: "movement", priviledge: "query")
`

export const Types = [Movement, NewMovement, MovementPatch, MovementList]

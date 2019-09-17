import { Movement } from './movement'
import { MovementList } from './movement-list'
import { MovementPatch } from './movement-patch'
import { NewMovement } from './new-movement'
import { directivePriviledge } from '@things-factory/auth-base'

export const Mutation = `
  createMovement (
    movement: NewMovement!
  ): Movement @priviledge(category: "warehouse", priviledge: "mutation")

  updateMovement (
    name: String!
    patch: MovementPatch!
  ): Movement @priviledge(category: "warehouse", priviledge: "mutation")

  deleteMovement (
    name: String!
  ): Boolean @priviledge(category: "warehouse", priviledge: "mutation")
    `

export const Query = `
  movements(filters: [Filter], pagination: Pagination, sortings: [Sorting]): MovementList @priviledge(category: "warehouse", priviledge: "query")
  movement(id: String!): Movement @priviledge(category: "warehouse", priviledge: "query")
`

export const Types = [Movement, NewMovement, MovementPatch, MovementList]

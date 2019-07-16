import { Filter, Pagination, Sorting } from '@things-factory/shell'
import { Movement } from './movement'
import { MovementList } from './movement-list'
import { MovementPatch } from './movement-patch'
import { NewMovement } from './new-movement'

export const Mutation = `
  createMovement (
    movement: NewMovement!
  ): Movement

  updateMovement (
    id: String!
    patch: MovementPatch!
  ): Movement

  deleteMovement (
    id: String!
  ): Movement
`

export const Query = `
  movements(filters: [Filter], pagination: Pagination, sortings: [Sorting]): MovementList
  movement(id: String!): Movement
`

export const Types = [Filter, Pagination, Sorting, Movement, NewMovement, MovementPatch, MovementList]

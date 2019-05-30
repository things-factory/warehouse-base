import { Movement } from './movement'
import { NewMovement } from './new-movement'
import { MovementPatch } from './movement-patch'

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

  publishMovement (
    id: String!
  ): Movement
`

export const Query = `
  movements: [Movement]
  movement(id: String!): Movement
`

export const Types = [Movement, NewMovement, MovementPatch]

import { Dock } from './dock'
import { NewDock } from './new-dock'
import { DockPatch } from './dock-patch'
import { DockList } from './dock-list'

export const Mutation = `
  createDock (
    dock: NewDock! 
  ): Dock @priviledge(category: "warehouse", priviledge: "mutation")

  updateDock (
    name: String!
    patch: DockPatch!
  ): Dock @priviledge(category: "warehouse", priviledge: "mutation")

  updateMultipleDock (
    patches: [DockPatch]!
  ): [Dock] @priviledge(category: "warehouse", priviledge: "mutation")

  deleteDock (
    name: String!
  ): Boolean @priviledge(category: "warehouse", priviledge: "mutation")

  deleteDocks (
    names: [String]!
  ): Boolean @priviledge(category: "warehouse", priviledge: "mutation")
`

export const Query = `
  docks(filters: [Filter], pagination: Pagination, sortings: [Sorting]): DockList @priviledge(category: "warehouse", priviledge: "query")
  dock(name: String!): Dock @priviledge(category: "warehouse", priviledge: "query")
`

export const Types = [Dock, NewDock, DockPatch, DockList]

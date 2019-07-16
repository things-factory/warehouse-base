import { Filter, Pagination, Sorting } from '@things-factory/shell'
import { Container } from './container'
import { ContainerList } from './container-list'
import { ContainerPatch } from './container-patch'
import { NewContainer } from './new-container'

export const Mutation = `
  createContainer (
    container: NewContainer!
  ): Container

  updateContainer (
    name: String!
    patch: ContainerPatch!
  ): Container

  deleteContainer (
    name: String!
  ): Container
`

export const Query = `
  containers(filters: [Filter], pagination: Pagination, sortings: [Sorting]): ContainerList
  container(name: String!): Container
`

export const Types = [Filter, Pagination, Sorting, Container, NewContainer, ContainerPatch, ContainerList]

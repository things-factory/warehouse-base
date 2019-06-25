import { Container } from './container'
import { NewContainer } from './new-container'
import { ContainerPatch } from './container-patch'
import { ContainerList } from './container-list'
import { Filter, Pagination, Sorting } from '@things-factory/shell'

export const Mutation = `
  createContainer (
    container: NewContainer!
  ): Container

  updateContainer (
    id: String!
    patch: ContainerPatch!
  ): Container

  deleteContainer (
    id: String!
  ): Container

  publishContainer (
    id: String!
  ): Container
`

export const Query = `
  containers(filters: [Filter], pagination: Pagination, sortings: [Sorting]): ContainerList
  container(id: String!): Container
`

export const Types = [Filter, Pagination, Sorting, Container, NewContainer, ContainerPatch, ContainerList]

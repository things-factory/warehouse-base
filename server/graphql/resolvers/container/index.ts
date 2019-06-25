import { containerResolver } from './container'
import { containersResolver } from './containers'

import { updateContainer } from './update-container'
import { createContainer } from './create-container'
import { deleteContainer } from './delete-container'

export const Query = {
  ...containersResolver,
  ...containerResolver
}

export const Mutation = {
  ...updateContainer,
  ...createContainer,
  ...deleteContainer
}

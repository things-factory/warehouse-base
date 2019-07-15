import { containerResolver } from './container'
import { containersResolver } from './containers'

import { createContainer } from './create-container'
import { deleteContainer } from './delete-container'
import { updateContainer } from './update-container'

export const Query = {
  ...containersResolver,
  ...containerResolver
}

export const Mutation = {
  ...updateContainer,
  ...createContainer,
  ...deleteContainer
}

import { store } from '@things-factory/shell'
import warehouseBase from './reducers/main'

export default function bootstrap() {
  store.addReducers({
    warehouseBase
  })
}

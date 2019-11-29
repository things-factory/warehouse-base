import { Container } from './container'
import { Dock } from './dock'
import { Inventory } from './inventory'
import { InventoryHistory } from './inventory-history'
import { Location } from './location'
import { Movement } from './movement'
import { Pallet } from './pallet'
import { Warehouse } from './warehouse'

export const entities = [Location, Inventory, InventoryHistory, Warehouse, Movement, Container, Dock, Pallet]

export { Location, Inventory, InventoryHistory, Warehouse, Movement, Container, Dock, Pallet }

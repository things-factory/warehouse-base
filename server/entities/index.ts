import { Inventory } from './inventory'
import { InventoryChange } from './inventory-change'
import { InventoryHistory } from './inventory-history'
import { ReducedInventoryHistory } from './reduced-inventory-history'
import { Location } from './location'
import { Movement } from './movement'
import { Warehouse } from './warehouse'
import { Pallet } from './pallet'
import { PalletHistory } from './pallet-history'
import { PalletCount } from './pallet-count'
import { PickingBin } from './picking-bin'

export const entities = [
  Location,
  Inventory,
  InventoryChange,
  InventoryHistory,
  ReducedInventoryHistory,
  Warehouse,
  Movement,
  Pallet,
  PalletHistory,
  PalletCount,
  PickingBin
]

export {
  Location,
  Inventory,
  InventoryChange,
  InventoryHistory,
  ReducedInventoryHistory,
  Warehouse,
  Movement,
  Pallet,
  PalletHistory,
  PalletCount,
  PickingBin
}

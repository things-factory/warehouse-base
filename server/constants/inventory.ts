export const INVENTORY_STATUS = {
  UNLOADED: 'UNLOADED',
  PARTIALLY_UNLOADED: 'PARTIALLY_UNLOADED',
  PUTTING_AWAY: 'PUTTING_AWAY',
  STORED: 'STORED',
  LOADED: 'LOADED',
  INTRANSIT: 'INTRANSIT',
  TERMINATED: 'TERMINATED',
  TRANSFERED: 'TRANSFERED',
  DELETED: 'DELETED',
  PICKED: 'PICKED'
}

export const INVENTORY_TYPES = {
  BUFFER: 'BUFFER',
  SHELF: 'SHELF'
}

export const INVENTORY_TRANSACTION_TYPE = {
  NEW: 'NEW',
  UNLOADING: 'UNLOADING',
  UNDO_UNLOADING: 'UNDO_UNLOADING',
  PUTAWAY: 'PUTAWAY',
  UNDO_PUTAWAY: 'UNDO_PUTAWAY',
  ADJUSTMENT: 'ADJUSTMENT',
  RELOCATE: 'RELOCATE',
  PICKING: 'PICKING',
  LOADING: 'LOADING',
  UNDO_LOADING: 'UNDO_LOADING',
  CANCEL_ORDER: 'CANCEL_ORDER',
  RETURN: 'RETURN',
  TERMINATED: 'TERMINATED',
  TRANSFERED_IN: 'TRANSFERED_IN',
  TRANSFERED_OUT: 'TRANSFERED_OUT',
  RELABELING: 'RELABELING',
  REPACKAGING: 'REPACKAGING',
  REPALLETIZING: 'REPALLETIZING'
}

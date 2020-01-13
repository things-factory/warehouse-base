export const INVENTORY_STATUS = {
  UNLOADED: 'UNLOADED',
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
  UNLOADING: 'UNLOADING',
  UNDO_UNLOADING: 'UNDO_UNLOADING',
  PUTAWAY: 'PUTAWAY',
  PICKING: 'PICKING',
  LOADING: 'LOADING',
  RETURNING: 'RETURNING',
  TERMINATED: 'TERMINATED',
  TRANSFERED_IN: 'TRANSFERED_IN',
  TRANSFERED_OUT: 'TRANSFERED_OUT'
}

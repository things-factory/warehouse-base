export const INVENTORY_STATUS = {
  UNLOADED: 'UNLOADED',
  STORED: 'STORED',
  LOADED: 'LOADED',
  INTRANSIT: 'INTRANSIT',
  TERMINATED: 'TERMINATED',
  TRANSFERED: 'TRANSFERED',
  DELETED: 'DELETED'
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
  TERMINATED: 'TERMINATED',
  TRANSFERED_IN: 'TRANSFERED_IN',
  TRANSFERED_OUT: 'TRANSFERED_OUT'
}

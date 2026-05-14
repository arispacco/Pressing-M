import Dexie, { type Table } from 'dexie'
import type { Garment } from '../models/types'

class PressingDatabase extends Dexie {
  garments!: Table<Garment, string>

  constructor() {
    super('pressing-db')

    this.version(1).stores({
      garments: 'id,clientName,washStatus,paymentStatus,createdAt',
    })
  }
}

export const db = new PressingDatabase()

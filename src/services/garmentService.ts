import { db } from '../db/database'
import type { Garment, PaymentStatus, WashStatus } from '../models/types'

const washOrder: WashStatus[] = ['PENDING', 'WASHED', 'DELIVERED']

export type NewGarmentInput = Omit<Garment, 'id' | 'createdAt'>

export const garmentService = {
  async getAll(): Promise<Garment[]> {
    const garments = await db.garments.orderBy('createdAt').reverse().toArray()

    return garments.map((garment) => ({
      ...garment,
      createdAt:
        garment.createdAt instanceof Date
          ? garment.createdAt
          : new Date(garment.createdAt),
    }))
  },

  async create(input: NewGarmentInput): Promise<string> {
    const garment: Garment = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }

    await db.garments.add(garment)

    return garment.id
  },

  async toggleWashStatus(id: string): Promise<Garment | undefined> {
    const garment = await db.garments.get(id)

    if (!garment) {
      return undefined
    }

    const currentIndex = washOrder.indexOf(garment.washStatus)
    const safeCurrentIndex = currentIndex === -1 ? 0 : currentIndex
    const nextStatus = washOrder[(safeCurrentIndex + 1) % washOrder.length]

    await db.garments.update(id, { washStatus: nextStatus })
    return db.garments.get(id)
  },

  async togglePaymentStatus(id: string): Promise<Garment | undefined> {
    const garment = await db.garments.get(id)

    if (!garment) {
      return undefined
    }

    const nextStatus: PaymentStatus = garment.paymentStatus === 'UNPAID' ? 'PAID' : 'UNPAID'

    await db.garments.update(id, { paymentStatus: nextStatus })
    return db.garments.get(id)
  },

  async getUniqueTypes(): Promise<string[]> {
    const garments = await db.garments.toArray()
    const types = new Set<string>()
    garments.forEach((garment) => {
      if (garment.type) {
        types.add(garment.type.trim().toLowerCase())
      }
    })
    return Array.from(types).sort((a,b) => a.localeCompare(b))
  },
}

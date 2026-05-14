export type WashStatus = 'PENDING' | 'WASHED' | 'DELIVERED'

export type PaymentStatus = 'UNPAID' | 'PAID'

export interface Garment {
  id: string
  clientName: string
  type: string
  imageBlob?: Blob
  price: number
  washStatus: WashStatus
  paymentStatus: PaymentStatus
  createdAt: Date
}

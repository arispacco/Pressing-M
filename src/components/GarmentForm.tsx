import { useState, type FormEvent } from 'react'
import type { PaymentStatus, WashStatus } from '../models/types'
import { garmentService } from '../services/garmentService'

type GarmentFormProps = {
  onCreated: () => Promise<void> | void
}

async function fileToBlob(file?: File): Promise<Blob | undefined> {
  if (!file) {
    return undefined
  }

  const buffer = await file.arrayBuffer()
  return new Blob([buffer], { type: file.type || 'application/octet-stream' })
}

export function GarmentForm({ onCreated }: GarmentFormProps) {
  const [clientName, setClientName] = useState('')
  const [garmentType, setGarmentType] = useState('')
  const [price, setPrice] = useState('')
  const [washStatus, setWashStatus] = useState<WashStatus>('PENDING')
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('UNPAID')
  const [imageFile, setImageFile] = useState<File | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setClientName('')
    setGarmentType('')
    setPrice('')
    setWashStatus('PENDING')
    setPaymentStatus('UNPAID')
    setImageFile(undefined)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (Number.isNaN(Number(price)) || Number(price) < 0) {
      return
    }

    setIsSubmitting(true)

    try {
      const imageBlob = await fileToBlob(imageFile)

      await garmentService.create({
        clientName: clientName.trim(),
        type: garmentType.trim(),
        imageBlob,
        price: Number(price),
        washStatus,
        paymentStatus,
      })

      resetForm()
      await onCreated()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Ajouter un vêtement</h2>

      <input
        type="text"
        required
        value={clientName}
        onChange={(event) => setClientName(event.target.value)}
        placeholder="Nom du client"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />

      <input
        type="text"
        required
        value={garmentType}
        onChange={(event) => setGarmentType(event.target.value)}
        placeholder="Type de vêtement"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />

      <input
        type="number"
        required
        min={0}
        value={price}
        onChange={(event) => setPrice(event.target.value)}
        placeholder="Prix (FCFA)"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />

      <div className="grid gap-2 sm:grid-cols-2">
        <select
          value={washStatus}
          onChange={(event) => setWashStatus(event.target.value as WashStatus)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="PENDING">PENDING</option>
          <option value="WASHED">WASHED</option>
          <option value="DELIVERED">DELIVERED</option>
        </select>

        <select
          value={paymentStatus}
          onChange={(event) => setPaymentStatus(event.target.value as PaymentStatus)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="UNPAID">UNPAID</option>
          <option value="PAID">PAID</option>
        </select>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={(event) => setImageFile(event.target.files?.[0])}
        className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </form>
  )
}

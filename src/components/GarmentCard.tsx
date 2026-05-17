import { useEffect, useMemo } from 'react'
import type { Garment } from '../models/types'
import { garmentService } from '../services/garmentService'
import { StatusBadge } from './StatusBadge'

type GarmentCardProps = {
  garment: Garment
  onUpdated: (updatedGarment: Garment) => Promise<void> | void
}

const fcfaFormatter = new Intl.NumberFormat('fr-FR')

export function GarmentCard({ garment, onUpdated }: GarmentCardProps) {
  const imageUrl = useMemo(() => {
    if (!garment.imageBlob) {
      return null
    }

    return URL.createObjectURL(garment.imageBlob)
  }, [garment.imageBlob])

  useEffect(
    () => () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl)
      }
    },
    [imageUrl],
  )

  const createdAtLabel = useMemo(
    () =>
      garment.createdAt.toLocaleString('fr-FR', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
    [garment.createdAt],
  )

  const handleToggleWash = async () => {
    const updatedGarment = await garmentService.toggleWashStatus(garment.id)
    if (updatedGarment) {
      await onUpdated(updatedGarment)
    }
  }

  const handleTogglePayment = async () => {
    const updatedGarment = await garmentService.togglePaymentStatus(garment.id)
    if (updatedGarment) {
      await onUpdated(updatedGarment)
    }
  }

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {imageUrl ? (
        <img src={imageUrl} alt={garment.type} className="h-44 w-full object-cover" />
      ) : (
        <div className="flex h-44 items-center justify-center bg-slate-100 text-sm text-slate-500">
          Pas d'image
        </div>
      )}

      <div className="space-y-3 p-4 text-left">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{garment.clientName}</h3>
          <p className="text-sm text-slate-600">{garment.type}</p>
          <p className="text-xs text-slate-500">Créé le {createdAtLabel}</p>
        </div>

        <p className="text-lg font-bold text-slate-900">{fcfaFormatter.format(garment.price)} FCFA</p>

        <div className="flex flex-wrap gap-2">
          <StatusBadge status={garment.washStatus} />
          <StatusBadge status={garment.paymentStatus} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleToggleWash}
            className="rounded-md bg-sky-700 px-3 py-2 text-xs font-medium text-white"
          >
            Changer lavage
          </button>
          <button
            type="button"
            onClick={handleTogglePayment}
            className="rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white"
          >
            Changer paiement
          </button>
        </div>
      </div>
    </article>
  )
}

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
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

const schema = yup.object({
  clientName: yup.string().trim().required('Le nom du client est requis'),
  type: yup.string().trim().required('Le type de vêtement est requis'),
  price: yup
    .number()
    .transform((value, originalValue) => {
      return String(originalValue).trim() === '' ? undefined : value
    })
    .typeError('Le prix doit être un nombre valide')
    .required('Le prix est requis')
    .min(0, 'Le prix ne peut pas être négatif'),
  washStatus: yup.mixed<WashStatus>().oneOf(['PENDING', 'WASHED', 'DELIVERED']).required(),
  paymentStatus: yup.mixed<PaymentStatus>().oneOf(['UNPAID', 'PAID']).required(),
  image: yup.mixed<FileList>().nullable().optional(),
})

type FormData = {
  clientName: string;
  type: string;
  price: number;
  washStatus: WashStatus;
  paymentStatus: PaymentStatus;
  image?: FileList | null;
}

export function GarmentForm({ onCreated }: GarmentFormProps) {
  const [garmentTypes, setGarmentTypes] = useState<string[]>([])
  const [showNewTypeInput, setShowNewTypeInput] = useState(false)

  useEffect(() => {
    garmentService.getUniqueTypes().then(setGarmentTypes).catch(console.error)
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    defaultValues: {
      clientName: '',
      type: '',
      washStatus: 'PENDING',
      paymentStatus: 'UNPAID',
    },
  })

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === 'new-type') {
      setShowNewTypeInput(true)
      setValue('type', '') // Clear type field when adding new
    } else {
      setShowNewTypeInput(false)
      setValue('type', event.target.value)
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      const file = data.image && data.image.length > 0 ? data.image[0] : undefined
      const imageBlob = await fileToBlob(file)

      await garmentService.create({
        clientName: data.clientName,
        type: data.type,
        imageBlob,
        price: data.price,
        washStatus: data.washStatus,
        paymentStatus: data.paymentStatus,
      })

      reset()
      setShowNewTypeInput(false) // Reset new type input visibility
      await onCreated()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Ajouter un vêtement</h2>

      <div>
        <input
          type="text"
          {...register('clientName')}
          placeholder="Nom du client"
          className={`w-full rounded-md border px-3 py-2 text-sm ${
            errors.clientName ? 'border-red-500' : 'border-slate-300'
          }`}
        />
        {errors.clientName && <p className="mt-1 text-xs text-red-600">{errors.clientName.message}</p>}
      </div>

      <div>
        {garmentTypes.length > 0 && !showNewTypeInput ? (
          <select
            {...register('type')}
            onChange={handleTypeChange}
            className={`w-full rounded-md border px-3 py-2 text-sm ${
              errors.type ? 'border-red-500' : 'border-slate-300'
            }`}
          >
            <option value="">Sélectionner un type</option>
            {garmentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
            <option value="new-type">Nouvelle catégorie...</option>
          </select>
        ) : (
          <input
            type="text"
            {...register('type')}
            placeholder="Type de vêtement"
            className={`w-full rounded-md border px-3 py-2 text-sm ${
              errors.type ? 'border-red-500' : 'border-slate-300'
            }`}
          />
        )}
        {showNewTypeInput && (
          <button
            type="button"
            onClick={() => {
              setShowNewTypeInput(false)
              setValue('type', '') // Clear the input field
            }}
            className="mt-1 text-xs text-blue-600 hover:underline"
          >
            Annuler l'ajout de nouveau type
          </button>
        )}
        {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>}
      </div>

      <div>
        <input
          type="number"
          step="any"
          {...register('price')}
          placeholder="Prix (FCFA)"
          className={`w-full rounded-md border px-3 py-2 text-sm ${
            errors.price ? 'border-red-500' : 'border-slate-300'
          }`}
        />
        {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <select
            {...register('washStatus')}
            className={`w-full rounded-md border px-3 py-2 text-sm ${
              errors.washStatus ? 'border-red-500' : 'border-slate-300'
            }`}
          >
            <option value="PENDING">PENDING</option>
            <option value="WASHED">WASHED</option>
            <option value="DELIVERED">DELIVERED</option>
          </select>
          {errors.washStatus && <p className="mt-1 text-xs text-red-600">{errors.washStatus.message}</p>}
        </div>

        <div>
          <select
            {...register('paymentStatus')}
            className={`w-full rounded-md border px-3 py-2 text-sm ${
              errors.paymentStatus ? 'border-red-500' : 'border-slate-300'
            }`}
          >
            <option value="UNPAID">UNPAID</option>
            <option value="PAID">PAID</option>
          </select>
          {errors.paymentStatus && <p className="mt-1 text-xs text-red-600">{errors.paymentStatus.message}</p>}
        </div>
      </div>

      <div>
        <input
          type="file"
          accept="image/*"
          {...register('image')}
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

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
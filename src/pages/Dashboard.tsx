import { useEffect, useState, useMemo } from 'react'
import { GarmentCard } from '../components/GarmentCard'
import { GarmentForm } from '../components/GarmentForm'
import type { Garment, PaymentStatus, WashStatus } from '../models/types'
import { garmentService } from '../services/garmentService'

export default function Dashboard() {
  const [garments, setGarments] = useState<Garment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showGarmentForm, setShowGarmentForm] = useState(false)

  // Filter states
  const [clientNameFilter, setClientNameFilter] = useState('')
  const [priceMinFilter, setPriceMinFilter] = useState<number | ''>('')
  const [priceMaxFilter, setPriceMaxFilter] = useState<number | ''>('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [washStatusFilter, setWashStatusFilter] = useState<WashStatus | ''>('')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatus | ''>('')
  const [uniqueGarmentTypes, setUniqueGarmentTypes] = useState<string[]>([])

  const loadGarments = async () => {
    setIsLoading(true)

    try {
      const data = await garmentService.getAll()
      setGarments(data)
      const types = await garmentService.getUniqueTypes()
      setUniqueGarmentTypes(types)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isCancelled = false

    void garmentService
      .getAll()
      .then((data) => {
        if (!isCancelled) {
          setGarments(data)
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false)
        }
      })
    
    // Also load unique garment types
    void garmentService.getUniqueTypes().then((types) => {
      if (!isCancelled) {
        setUniqueGarmentTypes(types)
      }
    })

    return () => {
      isCancelled = true
    }
  }, [])

  const handleGarmentCreated = async () => {
    await loadGarments()
    setShowGarmentForm(false) // Hide form after creation
  }

  const handleGarmentUpdated = (updatedGarment: Garment) => {
    setGarments((prevGarments) =>
      prevGarments.map((garment) =>
        garment.id === updatedGarment.id ? updatedGarment : garment,
      ),
    )
  }

  const filteredGarments = useMemo(() => {
    return garments.filter((garment) => {
      // Client Name Filter
      if (clientNameFilter && !garment.clientName.toLowerCase().includes(clientNameFilter.toLowerCase())) {
        return false
      }

      // Price Min Filter
      if (priceMinFilter !== '' && garment.price < priceMinFilter) {
        return false
      }

      // Price Max Filter
      if (priceMaxFilter !== '' && garment.price > priceMaxFilter) {
        return false
      }

      // Category Filter
      if (categoryFilter && garment.type.toLowerCase() !== categoryFilter.toLowerCase()) {
        return false
      }

      // Wash Status Filter
      if (washStatusFilter && garment.washStatus !== washStatusFilter) {
        return false
      }

      // Payment Status Filter
      if (paymentStatusFilter && garment.paymentStatus !== paymentStatusFilter) {
        return false
      }

      return true
    })
  }, [garments, clientNameFilter, priceMinFilter, priceMaxFilter, categoryFilter, washStatusFilter, paymentStatusFilter])

  return (
    <main className="mx-auto min-h-screen max-w-7xl bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 text-left">
        <h1 className="text-3xl font-bold text-slate-900">Pressing M</h1>
        <p className="mt-1 text-sm text-slate-600">Gestion locale des vêtements (Dexie / IndexedDB)</p>
      </header>

      <section className="mb-6">
        {!showGarmentForm && (
          <button
            type="button"
            onClick={() => setShowGarmentForm(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Ajouter un vêtement
          </button>
        )}
        {showGarmentForm && (
          <GarmentForm onCreated={handleGarmentCreated} />
        )}
      </section>

      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Filtres</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <input
            type="text"
            placeholder="Nom du client"
            value={clientNameFilter}
            onChange={(e) => setClientNameFilter(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Prix min"
            value={priceMinFilter}
            onChange={(e) => setPriceMinFilter(Number(e.target.value) || '')}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Prix max"
            value={priceMaxFilter}
            onChange={(e) => setPriceMaxFilter(Number(e.target.value) || '')}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Toutes catégories</option>
            {uniqueGarmentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            value={washStatusFilter}
            onChange={(e) => setWashStatusFilter(e.target.value as WashStatus | '')}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Tous statuts lavage</option>
            <option value="PENDING">PENDING</option>
            <option value="WASHED">WASHED</option>
            <option value="DELIVERED">DELIVERED</option>
          </select>
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value as PaymentStatus | '')}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Tous statuts paiement</option>
            <option value="UNPAID">UNPAID</option>
            <option value="PAID">PAID</option>
          </select>
        </div>
      </section>

      <section>
        {isLoading ? (
          <p className="text-sm text-slate-600">Chargement...</p>
        ) : filteredGarments.length === 0 ? (
          <p className="text-sm text-slate-600">Aucun vêtement enregistré pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGarments.map((garment) => (
              <GarmentCard key={garment.id} garment={garment} onUpdated={handleGarmentUpdated} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

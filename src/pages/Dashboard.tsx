import { useEffect, useState } from 'react'
import { GarmentCard } from '../components/GarmentCard'
import { GarmentForm } from '../components/GarmentForm'
import type { Garment } from '../models/types'
import { garmentService } from '../services/garmentService'

export default function Dashboard() {
  const [garments, setGarments] = useState<Garment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadGarments = async () => {
    setIsLoading(true)

    try {
      const data = await garmentService.getAll()
      setGarments(data)
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

    return () => {
      isCancelled = true
    }
  }, [])

  return (
    <main className="mx-auto min-h-screen max-w-7xl bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 text-left">
        <h1 className="text-3xl font-bold text-slate-900">Pressing M</h1>
        <p className="mt-1 text-sm text-slate-600">Gestion locale des vêtements (Dexie / IndexedDB)</p>
      </header>

      <section className="mb-6">
        <GarmentForm onCreated={loadGarments} />
      </section>

      <section>
        {isLoading ? (
          <p className="text-sm text-slate-600">Chargement...</p>
        ) : garments.length === 0 ? (
          <p className="text-sm text-slate-600">Aucun vêtement enregistré pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {garments.map((garment) => (
              <GarmentCard key={garment.id} garment={garment} onUpdated={loadGarments} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

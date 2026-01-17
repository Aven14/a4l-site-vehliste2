'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

interface Vehicle {
  id: string
  name: string
  price: number
  power: number | null
  vmax: number | null
  images: string
  brand: { id: string; name: string }
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/vehicles')
      .then(res => res.json())
      .then(data => {
        setVehicles(data)
        setLoading(false)
      })
  }, [])

  const filteredVehicles = useMemo(() => {
    if (!search.trim()) return vehicles
    const s = search.toLowerCase()
    return vehicles.filter(v =>
      v.name.toLowerCase().includes(s) ||
      v.brand.name.toLowerCase().includes(s)
    )
  }, [vehicles, search])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Chargement...</div>
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-display text-4xl font-bold text-white mb-2">
          Tous les <span className="text-green-400">Véhicules</span>
        </h1>
        <p className="text-gray-500 mb-6">Liste non-officielle des véhicules disponibles</p>

        {/* Barre de recherche */}
        <div className="mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Rechercher un véhicule ou une marque..."
            className="w-full max-w-md bg-dark-100 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
          />
          <p className="text-gray-500 text-sm mt-2">{filteredVehicles.length} véhicule(s)</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.map(vehicle => {
            const images = JSON.parse(vehicle.images || '[]')
            return (
              <Link href={`/vehicles/${vehicle.id}`} key={vehicle.id} className="card card-hover overflow-hidden group">
                <div className="aspect-video bg-dark-300 relative overflow-hidden">
                  {images[0] ? (
                    <img src={images[0]} alt={vehicle.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <span className="text-4xl">🚗</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-green-400 text-sm mb-1">{vehicle.brand.name}</p>
                  <h2 className="font-display text-lg font-bold text-white mb-2">{vehicle.name}</h2>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-green-400">{vehicle.price.toLocaleString()} €</span>
                    {vehicle.power && <span className="text-gray-500 text-sm">{vehicle.power} CV</span>}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {search ? 'Aucun véhicule trouvé pour cette recherche' : 'Aucun véhicule disponible'}
          </div>
        )}
      </div>
    </div>
  )
}

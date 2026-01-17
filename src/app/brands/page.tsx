'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

interface Brand {
  id: string
  name: string
  logo: string | null
  _count: { vehicles: number }
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/brands')
      .then(res => res.json())
      .then(data => {
        setBrands(data)
        setLoading(false)
      })
  }, [])

  const filteredBrands = useMemo(() => {
    if (!search.trim()) return brands
    const s = search.toLowerCase()
    return brands.filter(b => b.name.toLowerCase().includes(s))
  }, [brands, search])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Chargement...</div>
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-display text-4xl font-bold text-white mb-2">
          Toutes les <span className="text-green-400">Marques</span>
        </h1>
        <p className="text-gray-500 mb-6">Liste non-officielle des marques disponibles</p>

        {/* Barre de recherche */}
        <div className="mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Rechercher une marque..."
            className="w-full max-w-md bg-dark-100 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
          />
          <p className="text-gray-500 text-sm mt-2">{filteredBrands.length} marque(s)</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBrands.map(brand => (
            <Link href={`/brands/${brand.id}`} key={brand.id} className="card card-hover p-6 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-dark-300 rounded-xl flex items-center justify-center">
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} className="w-12 h-12 object-contain" />
                ) : (
                  <span className="font-display text-3xl font-bold text-green-400">{brand.name.charAt(0)}</span>
                )}
              </div>
              <h2 className="font-display text-xl font-bold text-white mb-2">{brand.name}</h2>
              <p className="text-gray-500">{brand._count.vehicles} véhicules</p>
            </Link>
          ))}
        </div>

        {filteredBrands.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {search ? 'Aucune marque trouvée pour cette recherche' : 'Aucune marque disponible'}
          </div>
        )}
      </div>
    </div>
  )
}

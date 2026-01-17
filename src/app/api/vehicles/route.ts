import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Liste tous les véhicules
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const brandId = searchParams.get('brandId')

  const vehicles = await prisma.vehicle.findMany({
    where: brandId ? { brandId } : undefined,
    include: { brand: true },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(vehicles)
}

// POST - Créer un véhicule (admin)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { name, description, price, images, brandId, category, power, trunk, vmax, seats } = await req.json()

  if (!name || !price || !brandId) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
  }

  const vehicle = await prisma.vehicle.create({
    data: {
      name,
      description,
      price,
      power,
      trunk,
      vmax,
      seats,
      images: JSON.stringify(images || []),
      brandId,
      category,
    },
  })

  return NextResponse.json(vehicle, { status: 201 })
}

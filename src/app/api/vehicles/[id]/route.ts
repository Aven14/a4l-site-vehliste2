import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Détail d'un véhicule
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: params.id },
    include: { brand: true },
  })

  if (!vehicle) {
    return NextResponse.json({ error: 'Véhicule non trouvé' }, { status: 404 })
  }

  return NextResponse.json(vehicle)
}

// PUT - Modifier un véhicule (admin)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { name, description, price, images, brandId, category, power, trunk, vmax, seats } = await req.json()

  const vehicle = await prisma.vehicle.update({
    where: { id: params.id },
    data: {
      name,
      description,
      price,
      power,
      trunk,
      vmax,
      seats,
      images: images ? JSON.stringify(images) : undefined,
      brandId,
      category,
    },
  })

  return NextResponse.json(vehicle)
}

// DELETE - Supprimer un véhicule (admin)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  await prisma.vehicle.delete({ where: { id: params.id } })

  return NextResponse.json({ success: true })
}

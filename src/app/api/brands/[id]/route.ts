import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Détail d'une marque
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const brand = await prisma.brand.findUnique({
    where: { id: params.id },
    include: { vehicles: true },
  })

  if (!brand) {
    return NextResponse.json({ error: 'Marque non trouvée' }, { status: 404 })
  }

  return NextResponse.json(brand)
}

// PUT - Modifier une marque (admin)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { name, logo } = await req.json()

  const brand = await prisma.brand.update({
    where: { id: params.id },
    data: { name, logo },
  })

  return NextResponse.json(brand)
}

// DELETE - Supprimer une marque (admin)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  await prisma.brand.delete({ where: { id: params.id } })

  return NextResponse.json({ success: true })
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// PUT modifier une annonce
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  try {
    const { price, mileage, condition, description, images, isAvailable } =
      await req.json()

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { dealership: true },
    })

    if (!user?.dealership) {
      return NextResponse.json(
        { error: 'Vous n\'avez pas de concessionnaire' },
        { status: 403 }
      )
    }

    // Vérifier que l'annonce appartient au concessionnaire
    const listing = await prisma.dealershipListing.findUnique({
      where: { id: params.id },
    })

    if (!listing || listing.dealershipId !== user.dealership.id) {
      return NextResponse.json(
        { error: 'Annonce non trouvée ou accès refusé' },
        { status: 403 }
      )
    }

    const updated = await prisma.dealershipListing.update({
      where: { id: params.id },
      data: {
        price: price !== undefined ? price : undefined,
        mileage: mileage !== undefined ? mileage : undefined,
        condition: condition !== undefined ? condition : undefined,
        description: description !== undefined ? description : undefined,
        images: images ? JSON.stringify(images) : undefined,
        isAvailable: isAvailable !== undefined ? isAvailable : undefined,
      },
      include: {
        vehicle: {
          include: { brand: true },
        },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Erreur modification annonce:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la modification de l\'annonce' },
      { status: 500 }
    )
  }
}

// DELETE supprimer une annonce
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { dealership: true },
    })

    if (!user?.dealership) {
      return NextResponse.json(
        { error: 'Vous n\'avez pas de concessionnaire' },
        { status: 403 }
      )
    }

    // Vérifier que l'annonce appartient au concessionnaire
    const listing = await prisma.dealershipListing.findUnique({
      where: { id: params.id },
    })

    if (!listing || listing.dealershipId !== user.dealership.id) {
      return NextResponse.json(
        { error: 'Annonce non trouvée ou accès refusé' },
        { status: 403 }
      )
    }

    await prisma.dealershipListing.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur suppression annonce:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'annonce' },
      { status: 500 }
    )
  }
}

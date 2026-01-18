import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dealership = await prisma.dealership.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            image: true,
          },
        },
        listings: {
          where: { isAvailable: true },
          include: {
            vehicle: {
              include: {
                brand: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!dealership) {
      return NextResponse.json(
        { error: 'Concessionnaire non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(dealership)
  } catch (error) {
    console.error('Erreur récupération concessionnaire:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du concessionnaire' },
      { status: 500 }
    )
  }
}

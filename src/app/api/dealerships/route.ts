import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET tous les concessionnaires
export async function GET() {
  try {
    const dealerships = await prisma.dealership.findMany({
      include: {
        user: {
          select: {
            username: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: {
            listings: {
              where: { isAvailable: true },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(dealerships)
  } catch (error) {
    console.error('Erreur récupération concessionnaires:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des concessionnaires' },
      { status: 500 }
    )
  }
}

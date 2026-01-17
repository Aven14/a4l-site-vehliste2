import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Force cette route à être dynamique
export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const user = session.user as any
  if (!user.canAccessAdmin) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  try {
    // Récupérer les paramètres
    const [logoSetting, faviconSetting] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { key: 'siteLogo' } }),
      prisma.siteSettings.findUnique({ where: { key: 'siteFavicon' } }),
    ])

    return NextResponse.json({
      siteLogo: logoSetting?.value || '',
      siteFavicon: faviconSetting?.value || '',
    })
  } catch (error) {
    console.error('Erreur récupération paramètres:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const user = session.user as any
  if (!user.canAccessAdmin) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  try {
    const { siteLogo, siteFavicon } = await req.json()

    // Mettre à jour ou créer les paramètres
    await Promise.all([
      prisma.siteSettings.upsert({
        where: { key: 'siteLogo' },
        update: { value: siteLogo || null },
        create: { key: 'siteLogo', value: siteLogo || null },
      }),
      prisma.siteSettings.upsert({
        where: { key: 'siteFavicon' },
        update: { value: siteFavicon || null },
        create: { key: 'siteFavicon', value: siteFavicon || null },
      }),
    ])

    return NextResponse.json({ message: 'Paramètres mis à jour' })
  } catch (error) {
    console.error('Erreur mise à jour paramètres:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

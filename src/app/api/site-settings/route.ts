import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force cette route à être dynamique
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Récupérer les paramètres (route publique)
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
    return NextResponse.json({
      siteLogo: '',
      siteFavicon: '',
    })
  }
}

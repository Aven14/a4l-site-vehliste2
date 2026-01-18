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

    const response = NextResponse.json({
      siteLogo: logoSetting?.value || '',
      siteFavicon: faviconSetting?.value || '',
    })

    // Cache les paramètres du site pendant 1 heure
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    
    return response
  } catch (error) {
    console.error('Erreur récupération paramètres:', error)
    const response = NextResponse.json({
      siteLogo: '',
      siteFavicon: '',
    })
    
    // En cas d'erreur, cache quand même 5 minutes
    response.headers.set('Cache-Control', 'public, s-maxage=300')
    return response
  }
}

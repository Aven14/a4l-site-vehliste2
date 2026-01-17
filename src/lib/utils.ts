/**
 * Fonction utilitaire pour obtenir l'URL de base du site
 * Force l'utilisation du domaine Vercel correct
 */
export function getBaseUrl(): string {
  const nextAuthUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  
  // Si l'URL contient netlify.app, la remplacer par vercel.app
  if (nextAuthUrl.includes('netlify.app')) {
    return 'https://a4l-site-vehliste.vercel.app'
  }
  
  // Si l'URL contient déjà vercel.app, l'utiliser telle quelle
  if (nextAuthUrl.includes('vercel.app')) {
    return nextAuthUrl
  }
  
  // Pour le développement local
  if (nextAuthUrl.includes('localhost')) {
    return nextAuthUrl
  }
  
  // Par défaut, utiliser le domaine Vercel correct
  return 'https://a4l-site-vehliste.vercel.app'
}

/**
 * Construit l'URL de base à partir de la requête HTTP
 * Utilisé comme fallback si NEXTAUTH_URL n'est pas défini
 */
export function getBaseUrlFromRequest(host: string | null): string {
  if (!host) {
    return getBaseUrl()
  }
  
  const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https'
  const cleanHost = host.split(':')[0]
  
  // Si c'est le domaine Netlify, le remplacer par Vercel
  if (cleanHost.includes('netlify.app')) {
    return 'https://a4l-site-vehliste.vercel.app'
  }
  
  return `${protocol}://${cleanHost}`
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    // Sur Netlify, les images sont optimisées automatiquement
    unoptimized: false,
  },
  // Mode SSR activé (pas d'export statique)
  // Les API routes fonctionneront sur Netlify Functions
}

module.exports = nextConfig

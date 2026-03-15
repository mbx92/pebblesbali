import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0',
  },
  modules: ['@nuxtjs/sitemap'],
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://pebblesbali.com',
    name: 'Pebbles Bali',
  },
  sitemap: {
    strictNuxtContentPaths: false,
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'robots', content: 'index, follow' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:site_name', content: 'Pebbles Bali' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      ],
    },
  },
  vite: {
    plugins: [tailwindcss() as any],
    server: {
      allowedHosts: true,
    },
  },
  nitro: {
    trustProxy: true,
  },
  runtimeConfig: {
    authEmail: process.env.NUXT_AUTH_EMAIL || '',
    authPassword: process.env.NUXT_AUTH_PASSWORD || '',
    midtransServerKey: process.env.NUXT_MIDTRANS_SERVER_KEY || '',
    rajaongkirApiKey: process.env.NUXT_RAJAONGKIR_API_KEY || '',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://pebblesbali.com',
      midtransClientKey: process.env.NUXT_PUBLIC_MIDTRANS_CLIENT_KEY || '',
      midtransIsProduction: process.env.NUXT_PUBLIC_MIDTRANS_IS_PRODUCTION || 'false',
    },
  },
})

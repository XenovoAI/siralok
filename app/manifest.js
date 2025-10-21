export default function manifest() {
  return {
    name: 'SIRCBSE - NEET & JEE Preparation Platform',
    short_name: 'SIRCBSE',
    description: 'Best NEET & JEE Preparation Platform with affordable question banks and study materials',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0EA5E9',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['education', 'learning'],
    shortcuts: [
      {
        name: 'Study Materials',
        short_name: 'Materials',
        description: 'Access study materials',
        url: '/materials',
        icons: [{ src: '/icon-materials.png', sizes: '96x96' }],
      },
      {
        name: 'Practice Tests',
        short_name: 'Tests',
        description: 'Take practice tests',
        url: '/tests',
        icons: [{ src: '/icon-tests.png', sizes: '96x96' }],
      },
    ],
  }
}

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
        src: '/logo.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'any maskable',
      },
    ],
    categories: ['education', 'learning'],
    shortcuts: [
      {
        name: 'Study Materials',
        short_name: 'Materials',
        description: 'Access study materials',
        url: '/materials',
      },
      {
        name: 'Practice Tests',
        short_name: 'Tests',
        description: 'Take practice tests',
        url: '/tests',
      },
    ],
  }
}

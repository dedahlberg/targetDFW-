import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Target In-Stock Command Center',
    short_name: 'Target In-Stock',
    description: 'Store-level Target inventory action dashboard',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f6f8',
    theme_color: '#cc0000',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/pwa-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any maskable'
      }
    ]
  };
}

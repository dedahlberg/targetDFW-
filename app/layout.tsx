import './styles.css';
import './mobile-order.css';
import type { Metadata, Viewport } from 'next';
import PwaRegister from './pwa-register';

export const metadata: Metadata = {
  title: 'Target In-Stock Command Center',
  description: 'Store-level Target inventory action dashboard',
  manifest: '/manifest.webmanifest',
  applicationName: 'Target In-Stock',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Target In-Stock'
  },
  icons: {
    icon: '/pwa-icon.svg',
    apple: '/pwa-icon.svg'
  }
};

export const viewport: Viewport = {
  themeColor: '#cc0000',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><PwaRegister />{children}</body></html>;
}

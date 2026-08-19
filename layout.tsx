import './styles.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Target In-Stock Command Center',
  description: 'Store-level Target inventory action dashboard'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

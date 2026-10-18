import type { Metadata, Viewport } from 'next';
import './globals.css';
import './holiday-theme.css';
import './christmas-experience.css';
import './mockup-christmas.css';
import './mockup-christmas.css';
import ChristmasAtmosphere from '@/components/christmas-atmosphere';
export const viewport: Viewport = { themeColor: '#0a1c16', colorScheme: 'dark' };
export const metadata: Metadata = {
  title: 'Buurtjes tussen de Kerken · 20 december · Alem', description: 'De buurtjes tussen de kerken in Alem komen op 20 december vanaf 16.00 uur samen bij Hart van Alem. Bekijk wie welk hapje meeneemt.',
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{children:React.ReactNode}>) {
  return <html lang="nl"><body><ChristmasAtmosphere />{children}</body></html>;
}

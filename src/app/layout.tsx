import type { Metadata, Viewport } from 'next';
import './globals.css';
import './holiday-theme.css';
import './christmas-experience.css';
import ChristmasAtmosphere from '@/components/christmas-atmosphere';
export const viewport: Viewport = { themeColor: '#0a1c16', colorScheme: 'dark' };
export const metadata: Metadata = {
  title: 'Pré-kerst buurtborrel · BringToGo', description: 'Buurtborrel in Hart van Alem, 20 december om 16.00 uur. Kijk welke hapjes de buren meenemen en voeg jouw hapje toe.',
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{children:React.ReactNode}>) {
  return <html lang="nl"><body><ChristmasAtmosphere />{children}</body></html>;
}

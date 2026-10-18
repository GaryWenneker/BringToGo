import type { Metadata, Viewport } from 'next';
import './globals.css';
import './holiday-theme.css';
export const viewport: Viewport = { themeColor: '#0a1119', colorScheme: 'dark' };
export const metadata: Metadata = {
  title: 'BringToGo · Samen iets lekkers', description: 'Samen een gevarieerd buffet. Bekijk wie wat meeneemt en voeg eenvoudig jouw hapje toe.',
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{children:React.ReactNode}>) {
  return <html lang="nl"><body>{children}</body></html>;
}

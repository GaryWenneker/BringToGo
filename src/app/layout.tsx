import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'BringToGo · Samen iets lekkers', description: 'Samen een gevarieerd buffet. Bekijk wie wat meeneemt en voeg eenvoudig jouw hapje toe.',
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{children:React.ReactNode}>) {
  return <html lang="nl"><body>{children}</body></html>;
}

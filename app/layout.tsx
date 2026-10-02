import './globals.css';
import type { Metadata, Viewport } from 'next';
import GrainOverlay from '@/components/GrainOverlay';
import PwaRegister from '@/components/PwaRegister';

export const metadata: Metadata = {
  title: 'Softly — Elderly Care Coordinator',
  description: 'A digital living room for coordinating elderly parent care, medications, doctor appointments, and local helpers.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Softly Care',
  },
};

export const viewport: Viewport = {
  themeColor: '#FDFCF8',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-softly-bg text-softly-text relative min-h-screen antialiased selection:bg-softly-coral/30 selection:text-softly-text">
        <GrainOverlay />
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}

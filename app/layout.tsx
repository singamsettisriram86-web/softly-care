import './globals.css';
import type { Metadata, Viewport } from 'next';
import GrainOverlay from '@/components/GrainOverlay';
import PwaRegister from '@/components/PwaRegister';
import PwaBackHandler from '@/components/PwaBackHandler';
import MobileBottomNav from '@/components/MobileBottomNav';

export const metadata: Metadata = {
  metadataBase: new URL('https://softlys.online'),
  title: 'Softly — Elderly Care Coordinator & Medication Reminders',
  description: 'A digital living room for coordinating elderly parent care, daily WhatsApp medication reminders, doctor appointments, and local verified helper accompaniment.',
  keywords: [
    'Softly',
    'Softly Care',
    'Softly Care Coordinator',
    'elderly care coordinator India',
    'WhatsApp medication reminder for parents',
    'elderly parent care from abroad',
    'local helper for elderly parents',
    'doctor appointment calendar sync',
    'diabetes BP medication tracker India',
  ],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon-48x48.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Softly — Elderly Care Coordinator',
    description: 'A digital living room for coordinating elderly parent care, medications, doctor appointments, and local helpers.',
    url: 'https://softlys.online',
    siteName: 'Softly Care',
    images: [
      {
        url: '/logo.png',
        width: 560,
        height: 560,
        alt: 'Softly Care Sprout Logo',
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Softly Care',
  },
  verification: {
    other: {
      'facebook-domain-verification': 'yc45a7jtiwpd6rlhjn9l65qtalwpii',
    },
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
      <head>
        <meta name="facebook-domain-verification" content="yc45a7jtiwpd6rlhjn9l65qtalwpii" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        {/* Schema.org Organization Structured Data for Google Search Favicon & Knowledge Graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Softly',
              url: 'https://softlys.online',
              logo: 'https://softlys.online/logo.png',
              sameAs: [
                'https://softlys.online',
              ],
            }),
          }}
        />
        {/* iOS PWA: Add to Home Screen support */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Softly" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;
                function isExtensionError(msg, url, err) {
                  var str = (msg || '') + ' ' + (url || '') + ' ' + (err && err.stack ? err.stack : '');
                  return str.indexOf('chrome-extension://') !== -1 || str.indexOf('moz-extension://') !== -1;
                }
                window.addEventListener('error', function(e) {
                  if (isExtensionError(e.message, e.filename, e.error)) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                  }
                }, true);
                window.addEventListener('unhandledrejection', function(e) {
                  var reason = e.reason;
                  if (reason && isExtensionError(reason.message, '', reason)) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                  }
                }, true);
              })();
            `,
          }}
        />
      </head>
      <body className="bg-softly-bg text-softly-text relative min-h-screen antialiased selection:bg-softly-coral/30 selection:text-softly-text pb-16 md:pb-0">
        <GrainOverlay />
        <PwaRegister />
        <PwaBackHandler />
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}

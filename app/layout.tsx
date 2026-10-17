import './globals.css';
import type { Metadata, Viewport } from 'next';
import GrainOverlay from '@/components/GrainOverlay';
import PwaRegister from '@/components/PwaRegister';

export const metadata: Metadata = {
  title: 'Softly — Elderly Care Coordinator',
  description: 'A digital living room for coordinating elderly parent care, medications, doctor appointments, and local helpers.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
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
      <head>
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
      <body className="bg-softly-bg text-softly-text relative min-h-screen antialiased selection:bg-softly-coral/30 selection:text-softly-text">
        <GrainOverlay />
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}

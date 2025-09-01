import type { Metadata } from "next";
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { SessionProvider } from '@/components/SessionProvider'
import GlobalLoading from '@/components/GlobalLoading'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import { getSession } from '@/lib/session'
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TECHSSOUQ - Premium Tech Gadgets & Electronics Store UAE",
    template: "%s | TECHSSOUQ"
  },
  description: "Discover premium audio speakers, wireless earphones, smart watches, and cutting-edge tech gadgets at TECHSSOUQ. Free UAE delivery, 24/7 support, and authentic products with warranty. Shop the latest technology in Dubai, Abu Dhabi, and across UAE.",
  keywords: [
    "tech gadgets UAE",
    "audio speakers Dubai",
    "wireless earphones Abu Dhabi",
    "smart watches UAE",
    "electronics store Dubai",
    "tech shop UAE",
    "gadgets online UAE",
    "premium electronics Dubai",
    "wireless headphones UAE",
    "smart devices Dubai",
    "tech accessories UAE",
    "electronic gadgets Dubai",
    "audio equipment UAE",
    "smart technology Dubai",
    "tech products UAE"
  ],
  authors: [{ name: "TECHSSOUQ Team" }],
  creator: "TECHSSOUQ",
  publisher: "TECHSSOUQ",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://techssouq.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://techssouq.com',
    siteName: 'TECHSSOUQ',
    title: 'TECHSSOUQ - Premium Tech Gadgets & Electronics Store UAE',
    description: 'Discover premium audio speakers, wireless earphones, smart watches, and cutting-edge tech gadgets at TECHSSOUQ. Free UAE delivery, 24/7 support, and authentic products with warranty.',
    images: [
      {
        url: '/Logo.png',
        width: 1200,
        height: 630,
        alt: 'TECHSSOUQ - Premium Tech Gadgets Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TECHSSOUQ - Premium Tech Gadgets & Electronics Store UAE',
    description: 'Discover premium audio speakers, wireless earphones, smart watches, and cutting-edge tech gadgets at TECHSSOUQ. Free UAE delivery, 24/7 support.',
    images: ['/Logo.png'],
    creator: '@techssouq',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Replace with actual Google verification code
    yandex: 'your-yandex-verification-code', // Replace with actual Yandex verification code
  },
  icons: {
    icon: [
      { url: "/Logo.png", sizes: "any" },
    ],
    shortcut: ["/Logo.png"],
    apple: ["/Logo.png"],
  },
  manifest: '/manifest.json',
  category: 'technology',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get initial session on the server side
  const initialSession = await getSession()

  return (
    <html lang="en">
      <body className="antialiased">
        {/* Prevent flash of incorrect theme by syncing data-theme early */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              var saved = localStorage.getItem('theme');
              var theme = saved || 'system';
              var effective = theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
              document.documentElement.setAttribute('data-theme', effective);
            } catch (e) {}
          })();
        `}} />
        <ThemeProvider>
          <ToastProvider>
            <SessionProvider initialSession={initialSession}>
              <AuthProvider>
                <GlobalLoading />
                <CartProvider>
                  <FavoritesProvider>
                    {children}
                    {/* WhatsApp floating button */}
                    <WhatsAppFloat 
                      phoneNumber="971508024236" 
                      message="Hello! I'm interested in your products from TECHSSOUQ."
                      position="bottom-right"
                      showOnMobile={true}
                    />
                  </FavoritesProvider>
                </CartProvider>
              </AuthProvider>
            </SessionProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

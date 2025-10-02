import { Metadata } from 'next'
import ShopPageClient from './ShopPageClient'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Shop Tech Gadgets & Electronics | TECHSSOUQ UAE',
  description: 'Browse our extensive collection of premium tech gadgets, audio speakers, wireless earphones, smart watches, and electronics. Free UAE delivery, competitive prices, and authentic products with warranty.',
  keywords: [
    'tech gadgets shop UAE',
    'electronics store Dubai',
    'audio speakers online',
    'wireless earphones shop',
    'smart watches UAE',
    'tech accessories store',
    'electronic gadgets Dubai',
    'audio equipment UAE',
    'smart devices shop',
    'tech products online UAE'
  ],
  openGraph: {
    title: 'Shop Tech Gadgets & Electronics | TECHSSOUQ UAE',
    description: 'Browse our extensive collection of premium tech gadgets, audio speakers, wireless earphones, smart watches, and electronics. Free UAE delivery, competitive prices.',
    type: 'website',
    url: 'https://techssouq.com/shop',
    siteName: 'TECHSSOUQ',
    images: [
      {
        url: '/Logo.png',
        width: 1200,
        height: 630,
        alt: 'TECHSSOUQ Shop - Tech Gadgets & Electronics',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop Tech Gadgets & Electronics | TECHSSOUQ UAE',
    description: 'Browse our extensive collection of premium tech gadgets, audio speakers, wireless earphones, smart watches, and electronics. Free UAE delivery, competitive prices.',
    images: ['/Logo.png'],
  },
  alternates: {
    canonical: '/shop',
  },
}

export default function ShopPage() {
  return (
    <>
      <StructuredData 
        type="website" 
        data={{
          name: 'TECHSSOUQ Shop',
          description: 'Browse our extensive collection of premium tech gadgets, audio speakers, wireless earphones, smart watches, and electronics',
          url: 'https://techssouq.com/shop'
        }} 
      />
      <ShopPageClient />
    </>
  )
}
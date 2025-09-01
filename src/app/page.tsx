import { Metadata } from 'next'
import { Suspense } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import ProductGrid from '@/components/ProductGrid'
import FAQSection from '@/components/FAQSection'
import CookieBanner from '@/components/CookieBanner'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'TECHSSOUQ - Premium Tech Gadgets & Electronics Store UAE',
  description: 'Discover premium audio speakers, wireless earphones, smart watches, and cutting-edge tech gadgets at TECHSSOUQ. Free UAE delivery, 24/7 support, and authentic products with warranty. Shop the latest technology in Dubai, Abu Dhabi, and across UAE.',
  keywords: [
    'tech gadgets UAE',
    'audio speakers Dubai',
    'wireless earphones Abu Dhabi',
    'smart watches UAE',
    'electronics store Dubai',
    'tech shop UAE',
    'gadgets online UAE',
    'premium electronics Dubai',
    'wireless headphones UAE',
    'smart devices Dubai',
    'tech accessories UAE',
    'electronic gadgets Dubai',
    'audio equipment UAE',
    'smart technology Dubai',
    'tech products UAE'
  ],
  openGraph: {
    title: 'TECHSSOUQ - Premium Tech Gadgets & Electronics Store UAE',
    description: 'Discover premium audio speakers, wireless earphones, smart watches, and cutting-edge tech gadgets at TECHSSOUQ. Free UAE delivery, 24/7 support, and authentic products with warranty.',
    type: 'website',
    url: 'https://techssouq.com',
    siteName: 'TECHSSOUQ',
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
  },
  alternates: {
    canonical: '/',
  },
}

export default function Home() {
  return (
    <>
      <StructuredData 
        type="website" 
        data={{
          name: 'TECHSSOUQ',
          description: 'Premium tech gadgets, audio speakers, wireless earphones, and smart watches in UAE',
          url: 'https://techssouq.com'
        }} 
      />
      <StructuredData 
        type="organization" 
        data={{
          name: 'TECHSSOUQ',
          url: 'https://techssouq.com',
          logo: 'https://techssouq.com/Logo.png',
          description: 'Premium tech gadgets and electronics store in UAE',
          address: {
            addressCountry: 'AE',
            addressRegion: 'Dubai'
          },
          contactPoint: {
            telephone: '+971-50-802-4236',
            contactType: 'customer service',
            availableLanguage: 'English'
          }
        }} 
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 fixed inset-0">
        <div className="relative h-full overflow-y-auto">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-0 top-0 w-1/4 h-full bg-gradient-to-r from-gray-800 to-transparent opacity-50"></div>
            <div className="absolute right-0 top-0 w-1/4 h-full bg-gradient-to-l from-gray-800 to-transparent opacity-50"></div>
          </div>
          
          {/* Main content container - Full width */}
          <div className="relative z-10 w-full">
            <Header />
            <Hero />
            <Footer />
          </div>
        </div>
      </div>
    </>
  )
}

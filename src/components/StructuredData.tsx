import { Product } from '@/lib/api'

interface StructuredDataProps {
  type: 'product' | 'website' | 'organization'
  data: any
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const generateStructuredData = () => {
    switch (type) {
      case 'product':
        return {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: data.name,
          description: data.description,
          image: data.images && data.images.length > 0 ? data.images : [data.image],
          brand: {
            '@type': 'Brand',
            name: 'TECHSSOUQ'
          },
          offers: {
            '@type': 'Offer',
            price: data.price.replace('AED ', '').replace(',', ''),
            priceCurrency: 'AED',
            availability: data.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            seller: {
              '@type': 'Organization',
              name: 'TECHSSOUQ'
            },
            priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          },
          aggregateRating: data.rating ? {
            '@type': 'AggregateRating',
            ratingValue: data.rating,
            reviewCount: data.reviewCount || 0
          } : undefined,
          category: data.category,
          sku: data._id,
          mpn: data._id,
          gtin: data._id,
          url: `https://techssouq.com/product/${data._id}`
        }

      case 'website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'TECHSSOUQ',
          description: 'Premium tech gadgets, audio speakers, wireless earphones, and smart watches in UAE',
          url: 'https://techssouq.com',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://techssouq.com/shop?search={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
          }
        }

      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'TECHSSOUQ',
          url: 'https://techssouq.com',
          logo: 'https://techssouq.com/Logo.png',
          description: 'Premium tech gadgets and electronics store in UAE',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'AE',
            addressRegion: 'Dubai'
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+971-50-802-4236',
            contactType: 'customer service',
            availableLanguage: 'English'
          },
          sameAs: [
            'https://www.facebook.com/techssouq',
            'https://www.instagram.com/techssouq',
            'https://twitter.com/techssouq'
          ]
        }

      default:
        return {}
    }
  }

  const structuredData = generateStructuredData()

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
}

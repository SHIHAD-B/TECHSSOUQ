import { Metadata } from 'next'
import { productsApi, Product } from '@/lib/api'

import StructuredData from '@/components/StructuredData'
import ProductPageClient from './ProductPageClient'

interface ProductPageProps {
  params: { id: string }
}

// Generate metadata for the product page
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const product = await productsApi.getById(params.id)
    
    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.',
      }
    }

    const price = product.price.replace('AED ', '').replace(',', '')
    const originalPrice = product.originalPrice.replace('AED ', '').replace(',', '')
    const discountAmount = parseInt(originalPrice) - parseInt(price)
    const discountPercentage = originalPrice !== '0' ? Math.round((discountAmount / parseInt(originalPrice)) * 100) : 0

    return {
      title: `${product.name} - Premium Tech Gadgets | TECHSSOUQ`,
      description: `${product.description || product.name}. Buy ${product.name} at ${product.price} with free UAE delivery. ${discountPercentage > 0 ? `${discountPercentage}% OFF! ` : ''}Authentic products with warranty.`,
      keywords: [
        product.name.toLowerCase(),
        'tech gadgets UAE',
        'electronics Dubai',
        'audio speakers',
        'wireless earphones',
        'smart watches',
        'TECHSSOUQ',
        'UAE tech store',
        'Dubai electronics',
        product.category?.toLowerCase() || 'gadgets'
      ],
      openGraph: {
        title: `${product.name} - TECHSSOUQ`,
        description: `${product.description || product.name}. Buy at ${product.price} with free UAE delivery.`,
        type: 'product',
        images: [
          {
            url: product.images && product.images.length > 0 ? product.images[0] : product.image,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
        url: `https://techssouq.com/product/${params.id}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} - TECHSSOUQ`,
        description: `${product.description || product.name}. Buy at ${product.price} with free UAE delivery.`,
        images: [product.images && product.images.length > 0 ? product.images[0] : product.image],
      },
      alternates: {
        canonical: `/product/${params.id}`,
      },
      other: {
        'product:price:amount': price,
        'product:price:currency': 'AED',
        'product:availability': product.inStock ? 'in stock' : 'out of stock',
        'product:condition': 'new',
        'product:retailer_item_id': params.id,
      },
    }
  } catch (error) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    }
  }
}

// Generate static params for better performance
export async function generateStaticParams() {
  try {
    const products = await productsApi.getPublished()
    return products.map((product) => ({
      id: product._id,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product: Product | null = null
  let error: string | null = null

  try {
    product = await productsApi.getById(params.id)
  } catch (err) {
    error = 'Failed to load product'
  }

  return (
    <>
      {product && <StructuredData type="product" data={product} />}
      <ProductPageClient params={params} initialProduct={product} initialError={error} />
    </>
  )
} 
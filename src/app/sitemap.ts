import { MetadataRoute } from 'next'
import { productsApi, Product } from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://techssouq.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = []
  
  try {
    const products = await productsApi.getPublished()
    
    productPages = products.map((product: Product) => ({
      url: `${baseUrl}/product/${product._id}`,
      lastModified: new Date(product.updatedAt || product.createdAt || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Error fetching products for sitemap:', error)
  }

  return [...staticPages, ...productPages]
}

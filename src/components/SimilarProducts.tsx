'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Eye } from 'lucide-react'
import { productsApi, Product } from '@/lib/api'
import AedIcon from './AedIcon'

interface SimilarProductsProps {
  productId: string
  currentProduct: Product
}

export default function SimilarProducts({ productId, currentProduct }: SimilarProductsProps) {
  const [similarProducts, setSimilarProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch similar products
  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const products = await productsApi.getSimilar(productId, 8)
        
        // Double-check to ensure current product is not included (frontend safety)
        const filteredProducts = products.filter(product => product._id !== productId)
        
       
        
        setSimilarProducts(filteredProducts)
      } catch (err) {
        console.error('Error fetching similar products:', err)
        setError('Failed to load similar products')
        setSimilarProducts([])
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchSimilarProducts()
    }
  }, [productId])

  // Helper function to extract numeric price value
  const extractPriceValue = (priceString: string): number => {
    const match = priceString.match(/AED\s*([\d,]+)/)
    if (match) {
      return parseInt(match[1].replace(/,/g, ''))
    }
    return 0
  }

  const formatViews = (count: number): string => {
    if (count >= 100000) {
      const value = count / 100000
      const formatted = value.toFixed(value >= 10 ? 0 : 1).replace(/\.0$/, '')
      return `${formatted}L`
    }
    if (count >= 1000) {
      const value = count / 1000
      const formatted = value.toFixed(value >= 10 ? 0 : 1).replace(/\.0$/, '')
      return `${formatted}k`
    }
    return count.toString()
  }



  // Don't render if no similar products
  if (loading) {
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-white mb-8">Similar Products</h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
        </div>
      </div>
    )
  }

 

  if (error || similarProducts.length === 0) {
    return null
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-white mb-8">Similar Products</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {similarProducts.map((product) => {
          const priceValue = extractPriceValue(product.price)
          const originalPriceValue = extractPriceValue(product.originalPrice)
          const discountAmount = originalPriceValue - priceValue

          return (
            <div key={product._id} className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-amber-400/20 transition-all duration-300 group">
              {/* Product Image */}
              <Link href={`/product/${product._id}`} className="block relative">
                <div className="relative w-full h-48 bg-gray-700 overflow-hidden">
                  <Image
                    src={product.images && product.images.length > 0 ? product.images[0] : product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.discount && product.discount !== '0% OFF' && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {product.discount}
                    </div>
                  )}
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-4">
                {/* Title and Rating */}
                <Link href={`/product/${product._id}`} className="block">
                  <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 hover:text-amber-400 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(product.rating || 0) ? 'text-amber-400 fill-current' : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">({product.reviewCount || 0})</span>
                  <div className="flex items-center gap-1 text-gray-400 ml-auto">
                    <Eye className="w-3 h-3" />
                    <span className="text-xs">{formatViews(product.views || 0)}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-amber-400 flex items-center gap-1">
                    <AedIcon className="text-amber-400" width={14} height={12} />
                    {priceValue.toLocaleString()}
                  </span>
                  {discountAmount > 0 && (
                    <span className="text-sm text-gray-400 line-through flex items-center gap-1">
                      <AedIcon className="text-gray-400" width={12} height={10} />
                      {originalPriceValue.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/product/${product._id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded text-sm font-medium bg-amber-600 hover:bg-amber-700 text-white transition-colors hover:scale-105 transform duration-200"
                  >
                    <Eye className="w-3 h-3" />
                    View Product
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

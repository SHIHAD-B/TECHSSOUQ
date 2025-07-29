import { Headphones, Watch, Speaker, Search } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

const products = [
  {
    id: 1,
    name: 'iPhone 14 Pro Max',
    price: 'AED 1,099',
    originalPrice: 'AED 1,499',
    category: 'Mobile',
    icon: Speaker,
    description: 'Latest iPhone with cutting-edge technology and advanced camera system',
    image: '/iphone1.png',
    discount: '25% OFF',
    priceValue: 1099
  },
  {
    id: 2,
    name: 'AirPods Pro 2nd Gen',
    price: 'AED 749',
    originalPrice: 'AED 949',
    category: 'Audio',
    icon: Headphones,
    description: 'Advanced wireless earbuds with adaptive audio and noise cancellation',
    image: '/iphone1.png',
    discount: '20% OFF',
    priceValue: 749
  },
  {
    id: 3,
    name: 'Apple Watch Series 8',
    price: 'AED 1,499',
    originalPrice: 'AED 1,899',
    category: 'Wearables',
    icon: Watch,
    description: 'Advanced smartwatch with health monitoring and fitness tracking',
    image: '/iphone1.png',
    discount: '20% OFF',
    priceValue: 1499
  },
  {
    id: 4,
    name: 'iPad Air 5th Gen',
    price: 'AED 2,199',
    originalPrice: 'AED 2,799',
    category: 'Tablets',
    icon: Headphones,
    description: 'Powerful tablet with M1 chip and stunning Liquid Retina display',
    image: '/iphone1.png',
    discount: '25% OFF',
    priceValue: 2199
  },
  {
    id: 5,
    name: 'MacBook Pro 14"',
    price: 'AED 6,999',
    originalPrice: 'AED 8,999',
    category: 'Computers',
    icon: Speaker,
    description: 'Professional laptop with M2 Pro chip and Liquid Retina XDR display',
    image: '/iphone1.png',
    discount: '22% OFF',
    priceValue: 6999
  },
  {
    id: 6,
    name: 'Apple TV 4K',
    price: 'AED 799',
    originalPrice: 'AED 999',
    category: 'Entertainment',
    icon: Watch,
    description: 'Stream your favorite content in stunning 4K HDR quality',
    image: '/iphone1.png',
    discount: '20% OFF',
    priceValue: 799
  },
  {
    id: 7,
    name: 'HomePod mini',
    price: 'AED 599',
    originalPrice: 'AED 799',
    category: 'Smart Home',
    icon: Headphones,
    description: 'Smart speaker with Siri and amazing sound quality',
    image: '/iphone1.png',
    discount: '25% OFF',
    priceValue: 599
  },
  {
    id: 8,
    name: 'Magic Keyboard',
    price: 'AED 399',
    originalPrice: 'AED 499',
    category: 'Accessories',
    icon: Speaker,
    description: 'Wireless keyboard with Touch ID and numeric keypad',
    image: '/iphone1.png',
    discount: '20% OFF',
    priceValue: 399
  },
  {
    id: 9,
    name: 'iPhone 13 Pro',
    price: 'AED 899',
    originalPrice: 'AED 1,199',
    category: 'Mobile',
    icon: Speaker,
    description: 'Professional iPhone with Pro camera system and A15 Bionic chip',
    image: '/iphone1.png',
    discount: '25% OFF',
    priceValue: 899
  },
  {
    id: 10,
    name: 'AirPods Max',
    price: 'AED 1,999',
    originalPrice: 'AED 2,499',
    category: 'Audio',
    icon: Headphones,
    description: 'Premium over-ear headphones with Active Noise Cancellation',
    image: '/iphone1.png',
    discount: '20% OFF',
    priceValue: 1999
  },
  {
    id: 11,
    name: 'iPad Pro 12.9"',
    price: 'AED 3,999',
    originalPrice: 'AED 4,999',
    category: 'Tablets',
    icon: Watch,
    description: 'Most powerful iPad with M2 chip and Liquid Retina XDR display',
    image: '/iphone1.png',
    discount: '20% OFF',
    priceValue: 3999
  },
  {
    id: 12,
    name: 'Mac Studio',
    price: 'AED 12,999',
    originalPrice: 'AED 15,999',
    category: 'Computers',
    icon: Speaker,
    description: 'Professional desktop with M2 Ultra chip for creative professionals',
    image: '/iphone1.png',
    discount: '19% OFF',
    priceValue: 12999
  }
]

interface ProductListProps {
  currentPage?: number
  itemsPerPage?: number
  onPageChange?: (page: number) => void
  searchQuery?: string
  selectedCategory?: string
  priceRange?: string
}

export default function ProductList({ 
  currentPage = 1, 
  itemsPerPage = 8, 
  onPageChange,
  searchQuery = '',
  selectedCategory = 'All',
  priceRange = 'All'
}: ProductListProps) {
  
  // Filter products based on search query, category, and price range
  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Category filter
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    
    // Price range filter
    let matchesPriceRange = true
    if (priceRange !== 'All') {
      const price = product.priceValue || 0
      switch (priceRange) {
        case 'Under AED 500':
          matchesPriceRange = price < 500
          break
        case 'AED 500 - AED 1,000':
          matchesPriceRange = price >= 500 && price <= 1000
          break
        case 'AED 1,000 - AED 2,000':
          matchesPriceRange = price >= 1000 && price <= 2000
          break
        case 'Over AED 2,000':
          matchesPriceRange = price > 2000
          break
        default:
          matchesPriceRange = true
      }
    }
    
    return matchesSearch && matchesCategory && matchesPriceRange
  })

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  return (
    <div className="w-full">
      {/* Results Count */}
      <div className="text-center mb-6">
        <p className="text-gray-300">
          {filteredProducts.length === 0 
            ? 'No products found' 
            : `Showing ${startIndex + 1}-${Math.min(endIndex, filteredProducts.length)} of ${filteredProducts.length} products`
          }
        </p>
      </div>

      {/* Products List */}
      {currentProducts.length > 0 ? (
        <div className="space-y-4 mb-8">
          {currentProducts.map((product) => {
            const IconComponent = product.icon
            return (
              <Link href={`/product/${product.id}`} key={product.id}>
                <div className="group bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl border border-gray-600 gap-2">
                  <div className="flex items-center space-x-6">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="96px"
                      />
                      {/* Discount Badge */}
                      <div className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {product.discount}
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-amber-400 transition-colors truncate">
                            {product.name}
                          </h3>
                          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <IconComponent className="w-4 h-4" />
                            <span>{product.category}</span>
                          </div>
                        </div>
                        
                        {/* Price and Action */}
                        <div className="flex flex-col items-end space-y-3 ml-4">
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="text-amber-400 font-bold text-lg">{product.price}</span>
                              <span className="text-gray-400 line-through text-sm">{product.originalPrice}</span>
                            </div>
                          </div>
                          
                          <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded text-sm transition-colors whitespace-nowrap">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No products found matching your criteria</p>
            <p className="text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange?.(page)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-amber-600 text-white'
                    : 'text-gray-300 bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}
    </div>
  )
} 
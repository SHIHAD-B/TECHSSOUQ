'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Star, ShoppingCart, Heart, Check, ZoomIn, Filter, SortAsc, SortDesc, X } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Mock product data - in a real app, this would come from an API
const products = {
  1: {
    id: 1,
    name: 'iPhone 14 Pro Max',
    price: 1099,
    originalPrice: 1499,
    discount: 25,
    rating: 4.8,
    reviews: 124,
    description: 'Experience the latest iPhone with cutting-edge technology. Featuring the A16 Bionic chip, stunning 6.7-inch Super Retina XDR display, and advanced camera system with 48MP main camera. Perfect for photography, gaming, and productivity.',
    features: [
      'A16 Bionic chip',
      '6.7-inch Super Retina XDR display',
      '48MP main camera system',
      'Always-On display',
      'Emergency SOS via satellite',
      '5G capable'
    ],
    specs: {
      'Display': '6.7-inch Super Retina XDR',
      'Chip': 'A16 Bionic',
      'Storage': '128GB, 256GB, 512GB, 1TB',
      'Camera': '48MP Main, 12MP Ultra Wide, 12MP Telephoto',
      'Battery': 'Up to 29 hours video playback',
      'Warranty': '1 year'
    },
    images: [
      '/iphone14F-removebg-preview.png',
      '/iphone14s-removebg-preview.png',
      '/iphone14c-removebg-preview.png',
      '/iphone14col-removebg-preview.png'
    ],
    colors: [
      { name: 'Deep Purple', stock: 5, inStock: true },
      { name: 'Gold', stock: 3, inStock: true },
      { name: 'Silver', stock: 4, inStock: true },
      { name: 'Space Black', stock: 0, inStock: false }
    ],
    inStock: true,
    stockCount: 12
  },
  2: {
    id: 2,
    name: 'Apple Watch Series 8',
    price: 1499,
    originalPrice: 1899,
    discount: 20,
    rating: 4.9,
    reviews: 89,
    description: 'Stay connected and track your health with the most advanced Apple Watch. Monitor heart rate, sleep patterns, and fitness metrics with precision. Features a stunning Always-On Retina display and up to 18-hour battery life.',
    features: [
      'Heart rate monitoring',
      'Sleep tracking',
      'GPS navigation',
      'Water resistant (50m)',
      '18-hour battery life',
      'Customizable watch faces'
    ],
    specs: {
      'Display': 'Always-On Retina',
      'Battery Life': 'Up to 18 hours',
      'Water Resistance': '50m',
      'Connectivity': 'Bluetooth, WiFi, Cellular',
      'Sensors': 'Heart rate, GPS, Accelerometer, Gyroscope',
      'Warranty': '1 year'
    },
    images: [
      '/iphone1.png',
      '/background-desert.jpg',
      '/iphone1.png',
      '/iphone1.png'
    ],
    colors: [
      { name: 'Midnight', stock: 3, inStock: true },
      { name: 'Starlight', stock: 2, inStock: true },
      { name: 'Silver', stock: 0, inStock: false },
      { name: 'Red', stock: 1, inStock: true }
    ],
    inStock: true,
    stockCount: 8
  },
  3: {
    id: 3,
    name: 'AirPods Pro 2nd Generation',
    price: 749,
    originalPrice: 949,
    discount: 20,
    rating: 4.7,
    reviews: 156,
    description: 'Immerse yourself in pure sound with the most advanced AirPods. Adaptive Audio automatically tunes the experience to your environment, while Active Noise Cancellation blocks out ambient noise for the ultimate listening experience.',
    features: [
      'Adaptive Audio',
      'Active Noise Cancellation',
      'Up to 6 hours listening time',
      'Touch controls',
      'Spatial audio with dynamic head tracking',
      'Sweat and water resistant'
    ],
    specs: {
      'Driver Size': 'Custom high-excursion',
      'Battery Life': 'Up to 6 hours',
      'Noise Cancellation': 'Adaptive Active',
      'Connectivity': 'Bluetooth 5.0',
      'Weight': '5.3g per earbud',
      'Warranty': '1 year'
    },
    images: [
      '/iphone1.png',
      '/iphone1.png',
      '/iphone1.png',
      '/iphone1.png'
    ],
    colors: [
      { name: 'White', stock: 22, inStock: true }
    ],
    inStock: true,
    stockCount: 22
  }
}

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    userName: 'Ahmed Al-Rashid',
    rating: 5,
    date: '2024-01-15',
    title: 'Excellent product!',
    comment: 'This iPhone is absolutely amazing. The camera quality is outstanding and the performance is incredible. Highly recommended!',
    verified: true,
    helpful: 12
  },
  {
    id: 2,
    userName: 'Sarah Johnson',
    rating: 4,
    date: '2024-01-10',
    title: 'Great but expensive',
    comment: 'The phone is fantastic, but it\'s quite expensive. The features are worth it though, especially the camera system.',
    verified: true,
    helpful: 8
  },
  {
    id: 3,
    userName: 'Mohammed Hassan',
    rating: 5,
    date: '2024-01-08',
    title: 'Best iPhone ever!',
    comment: 'I\'ve owned several iPhones and this is by far the best one. The battery life is incredible and the display is stunning.',
    verified: false,
    helpful: 15
  },
  {
    id: 4,
    userName: 'Emily Chen',
    rating: 3,
    date: '2024-01-05',
    title: 'Good but not perfect',
    comment: 'The phone is good overall, but I expected better battery life. The camera is great though.',
    verified: true,
    helpful: 5
  },
  {
    id: 5,
    userName: 'David Wilson',
    rating: 5,
    date: '2024-01-03',
    title: 'Outstanding performance',
    comment: 'This phone exceeds all my expectations. The A16 chip is incredibly fast and the camera system is revolutionary.',
    verified: true,
    helpful: 20
  },
  {
    id: 6,
    userName: 'Fatima Al-Zahra',
    rating: 4,
    date: '2024-01-01',
    title: 'Very satisfied',
    comment: 'Great phone with excellent features. The only minor issue is the price, but you get what you pay for.',
    verified: true,
    helpful: 7
  }
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [isInCart, setIsInCart] = useState(false)
  const [isInFavorites, setIsInFavorites] = useState(false)
  const [activeTab, setActiveTab] = useState('features')
  const [reviewFilter, setReviewFilter] = useState('all')
  const [reviewSort, setReviewSort] = useState('newest')

  const product = products[parseInt(params.id) as keyof typeof products]

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Product not found</h1>
            <Link href="/shop" className="text-amber-400 hover:text-amber-300">
              Back to Shop
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const discountAmount = product.originalPrice - product.price
  const discountPercentage = Math.round((discountAmount / product.originalPrice) * 100)

  const handleImageHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
  }

  const handleAddToCart = () => {
    setIsInCart(true)
    // In a real app, this would add to cart state
    alert('Added to cart!')
  }

  const handleAddToFavorites = () => {
    setIsInFavorites(!isInFavorites)
    alert(isInFavorites ? 'Removed from favorites!' : 'Added to favorites!')
  }

  // Filter and sort reviews
  const filteredAndSortedReviews = mockReviews
    .filter(review => {
      if (reviewFilter === 'all') return true
      if (reviewFilter === 'verified') return review.verified
      if (reviewFilter === '5-star') return review.rating === 5
      if (reviewFilter === '4-star') return review.rating === 4
      if (reviewFilter === '3-star') return review.rating === 3
      if (reviewFilter === '2-star') return review.rating === 2
      if (reviewFilter === '1-star') return review.rating === 1
      return true
    })
    .sort((a, b) => {
      if (reviewSort === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime()
      if (reviewSort === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime()
      if (reviewSort === 'highest') return b.rating - a.rating
      if (reviewSort === 'lowest') return a.rating - b.rating
      if (reviewSort === 'most-helpful') return b.helpful - a.helpful
      return 0
    })

  const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length
  const ratingCounts = {
    5: mockReviews.filter(r => r.rating === 5).length,
    4: mockReviews.filter(r => r.rating === 4).length,
    3: mockReviews.filter(r => r.rating === 3).length,
    2: mockReviews.filter(r => r.rating === 2).length,
    1: mockReviews.filter(r => r.rating === 1).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8 overflow-hidden">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/shop" className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-full overflow-hidden">
          {/* Product Images */}
          <div className="space-y-4 w-full max-w-full overflow-hidden">
            {/* Main Image with Zoom */}
            <div className="relative aspect-square bg-gray-800 rounded-xl overflow-hidden w-full max-w-full group">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain object-center transition-transform duration-300 group-hover:scale-150"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                priority
                style={{
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                }}
                onMouseMove={handleImageHover}
              />
              
              {/* Zoom Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none"></div>
              
              {/* Zoom Icon */}
              <div className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                <ZoomIn className="w-5 h-5" />
              </div>
              
              {/* Zoom Instructions */}
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                Hover to zoom
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3 w-full max-w-full overflow-hidden">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all bg-gray-700 ${
                    selectedImage === index ? 'border-amber-400' : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 25vw, (max-width: 1024px) 20vw, 15vw"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) ? 'text-amber-400 fill-current' : 'text-gray-600'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-300">{product.rating}</span>
                </div>
                <span className="text-gray-400">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-amber-400">AED {product.price}</span>
                <span className="text-xl text-gray-400 line-through">AED {product.originalPrice}</span>
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {product.discount}% OFF
                </span>
              </div>
              <p className="text-green-400 text-sm">You save AED {discountAmount}</p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Color</h3>
              <div className="flex gap-3">
                {product.colors.map((color, index) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(index)}
                    disabled={!color.inStock}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedColor === index
                        ? 'border-amber-400 bg-amber-400/10 text-amber-400'
                        : color.inStock
                        ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                        : 'border-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span>{color.name}</span>
                      <span className={`text-xs ${
                        color.inStock 
                          ? color.stock > 0 
                            ? 'text-green-400' 
                            : 'text-yellow-400'
                          : 'text-red-400'
                      }`}>
                        {color.inStock 
                          ? color.stock > 0 
                            ? `${color.stock} in stock` 
                            : 'Low stock'
                          : 'Out of stock'
                        }
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-600 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-white border-x border-gray-600">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-400">
                  {product.stockCount} in stock
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={isInCart}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-green-600 text-white py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isInCart ? 'Added to Cart' : 'Add to Cart'}
                </button>
                <button 
                  onClick={handleAddToFavorites}
                  className={`p-4 rounded-lg transition-colors ${
                    isInFavorites 
                      ? 'bg-pink-600 hover:bg-pink-700 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isInFavorites ? 'fill-current' : ''}`} />
                </button>
              </div>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-4 px-6 rounded-lg font-semibold transition-colors">
                Buy Now
              </button>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.colors[selectedColor]?.inStock ? (
                <div className="flex items-center gap-2 text-green-400">
                  <Check className="w-5 h-5" />
                  <span>
                    {product.colors[selectedColor].stock > 0 
                      ? `${product.colors[selectedColor].stock} in stock` 
                      : 'Low stock'
                    } - Free shipping
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-400">
                  <X className="w-5 h-5" />
                  <span>Out of stock</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
                      <div className="border-b border-gray-700">
              <div className="flex space-x-8">
                <button 
                  onClick={() => setActiveTab('features')}
                  className={`py-4 font-semibold transition-colors ${
                    activeTab === 'features' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Features
                </button>
                <button 
                  onClick={() => setActiveTab('specifications')}
                  className={`py-4 font-semibold transition-colors ${
                    activeTab === 'specifications' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Specifications
                </button>
                <button 
                  onClick={() => setActiveTab('reviews')}
                  className={`py-4 font-semibold transition-colors ${
                    activeTab === 'reviews' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Reviews ({mockReviews.length})
                </button>
              </div>
            </div>

            <div className="py-8">
              {/* Features Tab */}
              {activeTab === 'features' && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-gray-800 rounded-lg">
                        <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications Tab */}
              {activeTab === 'specifications' && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">Technical Specifications</h3>
                  <div className="space-y-3">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-3 border-b border-gray-700">
                        <span className="text-gray-400 font-medium">{key}</span>
                        <span className="text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Review Summary */}
                    <div className="lg:col-span-1">
                      <h3 className="text-xl font-semibold text-white mb-6">Review Summary</h3>
                      
                      {/* Average Rating */}
                      <div className="bg-gray-800 rounded-lg p-6 mb-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="text-4xl font-bold text-amber-400">{averageRating.toFixed(1)}</div>
                          <div>
                            <div className="flex items-center mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(averageRating) ? 'text-amber-400 fill-current' : 'text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-gray-400 text-sm">{mockReviews.length} reviews</p>
                          </div>
                        </div>
                        
                        {/* Rating Breakdown */}
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map(rating => (
                            <div key={rating} className="flex items-center gap-2">
                              <span className="text-sm text-gray-400 w-8">{rating}★</span>
                              <div className="flex-1 bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-amber-400 h-2 rounded-full"
                                  style={{ width: `${(ratingCounts[rating as keyof typeof ratingCounts] / mockReviews.length) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-400 w-8">{ratingCounts[rating as keyof typeof ratingCounts]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Review List */}
                    <div className="lg:col-span-2">
                      {/* Review Filters */}
                      <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1">
                          <select
                            value={reviewFilter}
                            onChange={(e) => setReviewFilter(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                          >
                            <option value="all">All Reviews</option>
                            <option value="verified">Verified Purchases</option>
                            <option value="5-star">5 Star</option>
                            <option value="4-star">4 Star</option>
                            <option value="3-star">3 Star</option>
                            <option value="2-star">2 Star</option>
                            <option value="1-star">1 Star</option>
                          </select>
                        </div>
                        
                        <div className="flex-1">
                          <select
                            value={reviewSort}
                            onChange={(e) => setReviewSort(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                          >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="highest">Highest Rated</option>
                            <option value="lowest">Lowest Rated</option>
                            <option value="most-helpful">Most Helpful</option>
                          </select>
                        </div>
                      </div>

                      {/* Reviews */}
                      <div className="space-y-6">
                        {filteredAndSortedReviews.map((review) => (
                          <div key={review.id} className="bg-gray-800 rounded-lg p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold text-white">{review.userName}</h4>
                                  {review.verified && (
                                    <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Verified</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating ? 'text-amber-400 fill-current' : 'text-gray-600'
                                      }`}
                                    />
                                  ))}
                                  <span className="text-gray-400 text-sm">{review.rating}/5</span>
                                </div>
                              </div>
                              <span className="text-gray-400 text-sm">{new Date(review.date).toLocaleDateString()}</span>
                            </div>
                            
                            <h5 className="font-semibold text-white mb-2">{review.title}</h5>
                            <p className="text-gray-300 mb-4">{review.comment}</p>
                            
                            <div className="flex items-center justify-between">
                              <button className="text-amber-400 hover:text-amber-300 text-sm">
                                Helpful ({review.helpful})
                              </button>
                              <button className="text-gray-400 hover:text-white text-sm">
                                Report
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {filteredAndSortedReviews.length === 0 && (
                        <div className="text-center py-12">
                          <p className="text-gray-400">No reviews found matching your criteria.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
        </div>
      </div>

      <Footer />
    </div>
  )
} 
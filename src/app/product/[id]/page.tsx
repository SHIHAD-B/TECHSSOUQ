'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Star, ShoppingCart, Heart, Check, ZoomIn, X } from 'lucide-react'
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

export default function ProductPage({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [isInCart, setIsInCart] = useState(false)
  const [isInFavorites, setIsInFavorites] = useState(false)

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
    // In a real app, this would toggle favorites state
    alert(isInFavorites ? 'Removed from favorites!' : 'Added to favorites!')
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
              <button className="text-amber-400 border-b-2 border-amber-400 py-4 font-semibold">
                Features
              </button>
              <button className="text-gray-400 hover:text-white py-4 font-semibold">
                Specifications
              </button>
              <button className="text-gray-400 hover:text-white py-4 font-semibold">
                Reviews
              </button>
            </div>
          </div>

          <div className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Features */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Key Features</h3>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specifications */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Specifications</h3>
                <div className="space-y-3">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">{key}</span>
                      <span className="text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
} 
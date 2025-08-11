'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useToast } from '@/contexts/ToastContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Package, Truck, CheckCircle, Clock, Eye, AlertCircle, ShoppingBag, Loader2, Star, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { ordersApi, Order, reviewsApi, Review } from '@/lib/api'
import ReviewForm from '@/components/ReviewForm'

export default function OrdersPage() {
  const { user, loading } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [reviews, setReviews] = useState<Review[]>([])
  const [selectedOrderForReview, setSelectedOrderForReview] = useState<string | null>(null)
  const [selectedProductForReview, setSelectedProductForReview] = useState<string | null>(null)
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (user) {
      fetchOrders()
      fetchReviews()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true)
      const fetchedOrders = await ordersApi.getByCustomer(user!.id)
      setOrders(fetchedOrders)
    } catch (err) {
      console.error('Error fetching orders:', err)
      showToast('Failed to load orders. Please try again later.', 'error')
    } finally {
      setOrdersLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const fetchedReviews = await reviewsApi.getAll({ customerId: user!.id })
      setReviews(fetchedReviews)
    } catch (err) {
      console.error('Error fetching reviews:', err)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />
      case 'processing':
        return <Clock className="w-5 h-5 text-amber-500" />
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Package className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-400 bg-green-900/20 border-green-500/30'
      case 'shipped':
        return 'text-blue-400 bg-blue-900/20 border-blue-500/30'
      case 'processing':
        return 'text-amber-400 bg-amber-900/20 border-amber-500/30'
      case 'cancelled':
        return 'text-red-400 bg-red-900/20 border-red-500/30'
      default:
        return 'text-gray-400 bg-gray-800 border-gray-600'
    }
  }

  const canReviewOrder = (order: Order) => {
    return order.status === 'delivered' && order.paymentStatus === 'paid'
  }

  const getExistingReview = (productId: string, orderId: string) => {
    return reviews.find(review => 
      review.productId === productId && review.orderId === orderId
    )
  }

  const handleReviewSubmitted = (review: Review) => {
    setReviews(prev => [...prev, review])
    showToast('Review submitted successfully!', 'success')
    setSelectedOrderForReview(null)
    setSelectedProductForReview(null)
  }

  const handleReviewUpdated = (updatedReview: Review) => {
    setReviews(prev => prev.map(review => 
      review._id === updatedReview?._id ? updatedReview : review
    ))
    showToast('Review updated successfully!', 'success')
  }

  const handleReviewDeleted = () => {
    fetchReviews()
    showToast('Review deleted successfully!', 'success')
  }

  const openReviewForm = (orderId: string, productId: string) => {
    setSelectedOrderForReview(orderId)
    setSelectedProductForReview(productId)
  }

  const closeReviewForm = () => {
    setSelectedOrderForReview(null)
    setSelectedProductForReview(null)
  }

  if (loading || ordersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4" />
              <p className="text-gray-300">Loading your orders...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <Package className="w-8 h-8 text-amber-400" />
          My Orders ({orders.length})
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-4">No orders yet</h2>
            <p className="text-gray-300 mb-6">Start shopping to see your orders here.</p>
            
            <Link
              href="/shop"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cancellation Notice Banner */}
            <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-amber-300 mb-1">Order Cancellation Policy</h3>
                  <p className="text-sm text-amber-200">
                    Orders cannot be cancelled once placed. If you need assistance or have questions, 
                    please contact our admin team for help.
                  </p>
                </div>
              </div>
            </div>

            {orders.map((order) => (
              <div key={order?._id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                {/* Order Header */}
                <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4 mb-2 sm:mb-0">
                      <h3 className="text-lg font-semibold text-white">
                        Order #{order.orderNumber || order?._id}
                      </h3>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-300">
                      Ordered on {new Date(order.orderDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {/* Delivery Time for Delivered Orders */}
                  {order.status === 'delivered' && order.deliveredAt && (
                    <div className="mt-2 text-sm text-green-400">
                      Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                {/* Order Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Items */}
                    <div className="lg:col-span-2">
                      <h4 className="font-medium text-white mb-3">Items Ordered</h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => {
                          const productId = typeof item?.productId === 'object' ? item?.productId?._id : item?.productId
                          const existingReview = getExistingReview(productId, order?._id)
                          const canReview = canReviewOrder(order)
                          
                          return (
                            <div key={index} className="py-3 border-b border-gray-700 last:border-b-0">
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-gray-600 rounded-lg overflow-hidden">
                                    {typeof item?.productId === 'object' && item?.productId?.image ? (
                                      <img 
                                        src={item?.productId?.image} 
                                        alt={item.productName}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement
                                          target.style.display = 'none'
                                          target.nextElementSibling?.classList.remove('hidden')
                                        }}
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-gray-500 rounded-lg flex items-center justify-center">
                                        <Package className="w-6 h-6 text-gray-400" />
                                      </div>
                                    )}
                                    <div className="w-full h-full bg-gray-500 rounded-lg flex items-center justify-center hidden">
                                      <Package className="w-6 h-6 text-gray-400" />
                                    </div>
                                  </div>
                                  <div>
                                    <span className="font-medium text-white">{item.productName}</span>
                                    <span className="text-gray-400 ml-2">x{item.quantity}</span>
                                    {(item.color || item.size) && (
                                      <div className="text-gray-500 text-xs mt-1">
                                        {item.color && <span className="mr-2">Color: {item.color}</span>}
                                        {item.size && <span>Size: {item.size}</span>}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <span className="font-medium text-amber-400">AED {item.price.toFixed(2)}</span>
                              </div>
                              
                              {/* Review Section for Delivered Orders */}
                              {canReview && (
                                <div className="ml-15 mt-3">
                                  {existingReview ? (
                                    <div className="flex items-center gap-2 text-sm">
                                      <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                          <Star
                                            key={i}
                                            className={`w-4 h-4 ${
                                              i < existingReview.rating ? 'text-amber-400 fill-current' : 'text-gray-600'
                                            }`}
                                          />
                                        ))}
                                      </div>
                                      <span className="text-gray-400">Your review</span>
                                      <button
                                        onClick={() => openReviewForm(order?._id, productId)}
                                        className="text-amber-400 hover:text-amber-300 text-sm underline"
                                      >
                                        Edit
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => openReviewForm(order?._id, productId)}
                                      className="flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm"
                                    >
                                      <MessageSquare className="w-4 h-4" />
                                      Write a Review
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    
                    {/* Order Summary */}
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-3">Order Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Subtotal</span>
                          <span className="font-medium text-white">AED {(order.subtotal || order.totalAmount).toFixed(2)}</span>
                        </div>
                        {order.tax !== undefined && order.tax > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-300">Tax (VAT 5%)</span>
                            <span className="font-medium text-white">AED {order.tax.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-300">Shipping</span>
                          <span className="font-medium text-white">Free</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t border-gray-600 pt-2">
                          <span className="text-white">Total</span>
                          <span className="text-amber-400">AED {order.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-600">
                        <div className="text-sm text-gray-300 mb-2">
                          <strong>Payment Status:</strong>
                        </div>
                        <div className={`text-sm font-medium ${
                          order.paymentStatus === 'paid' ? 'text-green-400' : 
                          order.paymentStatus === 'failed' ? 'text-red-400' : 'text-amber-400'
                        }`}>
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-600">
                        <div className="text-sm text-gray-300 mb-2">
                          <strong>Shipping Address:</strong>
                        </div>
                        <div className="text-sm text-gray-200">
                          {order.shippingAddress}
                        </div>
                      </div>

                      {order.trackingNumber && (
                        <div className="mt-4 pt-4 border-t border-gray-600">
                          <div className="text-sm text-gray-300 mb-1">Tracking Number:</div>
                          <div className="text-sm font-mono text-gray-200">{order.trackingNumber}</div>
                        </div>
                      )}

                      {order.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-600">
                          <div className="text-sm text-gray-300 mb-1">Admin Notes:</div>
                          <div className="text-sm text-gray-200">{order.notes}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="mt-6 pt-6 border-t border-gray-700 flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/order-confirmation?orderId=${order?._id}`}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors border border-gray-600"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Link>
                    
                    {order.status === 'shipped' && (
                      <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-900/20 hover:bg-blue-900/30 text-blue-400 font-medium rounded-lg transition-colors border border-blue-500/30">
                        <Truck className="w-4 h-4" />
                        Track Package
                      </button>
                    )}
                    
                    {order.status === 'delivered' && (
                      <button className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-900/20 hover:bg-amber-900/30 text-amber-400 font-medium rounded-lg transition-colors border border-amber-500/30">
                        <ShoppingBag className="w-4 h-4" />
                        Reorder Items
                      </button>
                    )}

                    {order.status === 'cancelled' && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-red-900/20 text-red-400 rounded-lg border border-red-500/30">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">Order Cancelled</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Form Modal */}
      {selectedOrderForReview && selectedProductForReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Write a Review</h2>
                <button
                  onClick={closeReviewForm}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <ReviewForm
                productId={selectedProductForReview}
                orderId={selectedOrderForReview}
                customerId={user!.id}
                customerName={user!.user_metadata?.first_name ? `${user!.user_metadata.first_name} ${user!.user_metadata.last_name || ''}`.trim() : user!.email || 'Customer'}
                customerEmail={user!.email || ''}
                existingReview={getExistingReview(selectedProductForReview, selectedOrderForReview)}
                onReviewSubmitted={handleReviewSubmitted}
                onReviewUpdated={handleReviewUpdated}
                onReviewDeleted={handleReviewDeleted}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
} 
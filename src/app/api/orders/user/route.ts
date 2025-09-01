import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import { validateUserId } from '@/lib/appwrite-server'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    // Get user from auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = authHeader.substring(7)
    
    // Validate user ID against session
    const isValidUser = await validateUserId(userId)
    if (!isValidUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Fetch orders for the user
    const orders = await Order.find({ customerId: userId })
      .sort({ orderDate: -1 }) // Most recent first
      .lean()
    
    return NextResponse.json(orders)
    
  } catch (error) {
    console.error('Error fetching user orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
} 
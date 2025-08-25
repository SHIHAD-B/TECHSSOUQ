import { NextRequest, NextResponse } from 'next/server'
import { validateUserId } from '@/lib/appwrite-server'
import Favorite from '@/models/Favorite'
import Product from '@/models/Product'
import connectDB from '@/lib/mongodb'

// GET /api/favorites - Get user's favorites
export async function GET(request: NextRequest) {
  try {
    console.log('Favorites API called')
    
    // Get user from auth header
    const authHeader = request.headers.get('authorization')
    console.log('Auth header:', authHeader)
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid auth header')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = authHeader.substring(7)
    console.log('User ID from header:', userId)
    
    // Validate user ID against session
    const isValidUser = await validateUserId(userId)
    console.log('User validation result:', isValidUser)
    
    if (!isValidUser) {
      console.log('User validation failed')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB() 
    
    // Find user's favorites
    const favorites = await Favorite.find({ userId: userId }).populate('productId')
    console.log('Found favorites:', favorites.length)
    
    return NextResponse.json(favorites)
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/favorites - Add product to favorites
export async function POST(request: NextRequest) {
  try {
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

    const { productId } = await request.json()
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    await connectDB()
    
    // Verify product exists
    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({ userId: userId, productId })
    if (existingFavorite) {
      return NextResponse.json({ error: 'Product already in favorites' }, { status: 400 })
    }

    // Add to favorites
    const favorite = new Favorite({ userId: userId, productId })
    await favorite.save()
    
    // Populate product details for response
    await favorite.populate('productId')
    
    return NextResponse.json(favorite)
  } catch (error) {
    console.error('Error adding to favorites:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/favorites - Remove product from favorites
export async function DELETE(request: NextRequest) {
  try {
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

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    await connectDB()
    
    // Remove from favorites
    const result = await Favorite.findOneAndDelete({ userId: userId, productId })
    
    if (!result) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Removed from favorites' })
  } catch (error) {
    console.error('Error removing from favorites:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'
import mongoose from 'mongoose'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const limit = parseInt(searchParams.get('limit') || '8')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Get the current product to extract its characteristics
    const currentProduct = await Product.findById(productId)
    if (!currentProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Build search criteria based on product characteristics
    const searchCriteria = []
    
    // Search by category (highest priority)
    if (currentProduct.category && currentProduct.category !== 'Uncategorized') {
      searchCriteria.push({ category: currentProduct.category })
    }
    
    // Search by features (if available)
    if (currentProduct.features && currentProduct.features.length > 0) {
      const featureQueries = currentProduct.features.map(feature => ({
        features: { $regex: feature, $options: 'i' }
      }))
      searchCriteria.push({ $or: featureQueries })
    }
    
    // Search by specifications (if available)
    if (currentProduct.specifications && Object.keys(currentProduct.specifications).length > 0) {
      const specQueries = Object.entries(currentProduct.specifications).map(([key, value]) => ({
        [`specifications.${key}`]: { $regex: value, $options: 'i' }
      }))
      searchCriteria.push({ $or: specQueries })
    }
    
    // Search by description keywords
    if (currentProduct.description) {
      const descriptionWords = currentProduct.description
        .split(' ')
        .filter(word => word.length > 3) // Only words longer than 3 characters
        .slice(0, 5) // Limit to first 5 words
      
      if (descriptionWords.length > 0) {
        const descQueries = descriptionWords.map(word => ({
          description: { $regex: word, $options: 'i' }
        }))
        searchCriteria.push({ $or: descQueries })
      }
    }
    
    // Search by product name keywords
    if (currentProduct.name) {
      const nameWords = currentProduct.name
        .split(' ')
        .filter(word => word.length > 2) // Only words longer than 2 characters
        .slice(0, 3) // Limit to first 3 words
      
      if (nameWords.length > 0) {
        const nameQueries = nameWords.map(word => ({
          name: { $regex: word, $options: 'i' }
        }))
        searchCriteria.push({ $or: nameQueries })
      }
    }

    // If no specific criteria, fall back to category-based search
    if (searchCriteria.length === 0) {
      searchCriteria.push({ category: currentProduct.category || 'Uncategorized' })
    }

    // Build the final query - ensure proper ObjectId conversion
    const query = {
      _id: { $ne: new mongoose.Types.ObjectId(productId) }, // Exclude current product
      status: 'published', // Only published products
      $or: searchCriteria
    }


    // Find similar products with scoring
    const similarProducts = await Product.aggregate([
      { $match: query },
      {
        $addFields: {
          score: {
            $sum: [
              // Category match (highest weight)
              { $cond: [{ $eq: ['$category', currentProduct.category] }, 10, 0] },
              // Feature matches
              {
                $multiply: [
                  {
                    $size: {
                      $setIntersection: [
                        '$features',
                        currentProduct.features || []
                      ]
                    }
                  },
                  5
                ]
              },
              // Description similarity (simplified)
              {
                $cond: [
                  {
                    $regexMatch: {
                      input: '$description',
                      regex: currentProduct.description ? currentProduct.description.split(' ').slice(0, 3).join('|') : '',
                      options: 'i'
                    }
                  },
                  2,
                  0
                ]
              },
              // Name similarity (simplified)
              {
                $cond: [
                  {
                    $regexMatch: {
                      input: '$name',
                      regex: currentProduct.name ? currentProduct.name.split(' ').slice(0, 2).join('|') : '',
                      options: 'i'
                    }
                  },
                  1,
                  0
                ]
              }
            ]
          }
        }
      },
      { $sort: { score: -1 } },
      { $limit: limit }
    ])

    // Double-check to ensure current product is excluded (safety measure)
    const filteredProducts = similarProducts.filter(product => 
      product._id.toString() !== productId
    )


    // Ensure backward compatibility by adding default values
    const processedProducts = filteredProducts.map(product => ({
      ...product,
      images: product.images || [product.image],
      features: product.features || [],
      specifications: product.specifications || {},
      colors: product.colors || [],
      showFeatures: product.showFeatures || false,
      showSpecifications: product.showSpecifications || false,
      showColors: product.showColors !== undefined ? product.showColors : true
    }))

    return NextResponse.json(processedProducts)
  } catch (error) {
    console.error('Error fetching similar products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch similar products' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const product = await Product.findById(params.id)
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Ensure backward compatibility by adding default values for new fields
    const productObj = product.toObject()
    const processedProduct = {
      ...productObj,
      images: productObj.images || [productObj.image], // Default to main image if no images array
      features: productObj.features || [],
      specifications: productObj.specifications || {},
      colors: productObj.colors || [],
      showFeatures: productObj.showFeatures || false,
      showSpecifications: productObj.showSpecifications || false,
      showColors: productObj.showColors !== undefined ? productObj.showColors : true
    }
    
    return NextResponse.json(processedProduct)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const body = await request.json()
    
    // Process images - ensure first image is the main image
    let images = body.images || []
    if (body.image && !images.includes(body.image)) {
      images = [body.image, ...images]
    }
    
    // Limit images to 4
    if (images.length > 4) {
      images = images.slice(0, 4)
    }

    // Process features - filter out empty strings
    const features = (body.features || []).filter((feature: string) => feature.trim() !== '')

    // Process specifications - filter out empty keys
    const specifications = body.specifications || {}
    const cleanSpecifications: Record<string, string> = {}
    Object.keys(specifications).forEach(key => {
      if (key.trim() !== '' && specifications[key].trim() !== '') {
        cleanSpecifications[key.trim()] = specifications[key].trim()
      }
    })

    // Process colors - filter out empty names
    const colors = (body.colors || []).filter((color: any) => 
      color.name && color.name.trim() !== ''
    )

    const updateData = {
      ...body,
      images,
      features,
      specifications: cleanSpecifications,
      colors,
      showFeatures: body.showFeatures || features.length > 0,
      showSpecifications: body.showSpecifications || Object.keys(cleanSpecifications).length > 0,
      showColors: body.showColors !== undefined ? body.showColors : colors.length > 0,
      updatedAt: new Date()
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    )
    
    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Ensure backward compatibility for the updated product
    const productObj = updatedProduct.toObject()
    const processedProduct = {
      ...productObj,
      images: productObj.images || [productObj.image],
      features: productObj.features || [],
      specifications: productObj.specifications || {},
      colors: productObj.colors || [],
      showFeatures: productObj.showFeatures || false,
      showSpecifications: productObj.showSpecifications || false,
      showColors: productObj.showColors !== undefined ? productObj.showColors : true
    }
    
    console.log('Product updated in MongoDB:', updatedProduct._id)
    
    return NextResponse.json(processedProduct)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const deletedProduct = await Product.findByIdAndDelete(params.id)
    
    if (!deletedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    console.log('Product deleted from MongoDB:', deletedProduct._id)
    
    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
} 
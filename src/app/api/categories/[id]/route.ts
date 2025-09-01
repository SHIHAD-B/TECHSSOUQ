import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Category from '@/models/Category'
import Product from '@/models/Product'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const category = await Category.findById(params.id)
    if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const body = await request.json()
    const update: Record<string, unknown> = {}
    
    // Get the current category to check if name is being changed
    const currentCategory = await Category.findById(params.id)
    if (!currentCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    
    if (typeof body.name === 'string') {
      const newName = body.name.trim()
      
      // Check for case-insensitive duplicate names (excluding current category)
      const existingCategory = await Category.findOne({
        _id: { $ne: params.id },
        name: { $regex: `^${newName}$`, $options: 'i' }
      })
      
      if (existingCategory) {
        return NextResponse.json({ 
          error: 'Category with this name already exists (case-insensitive)' 
        }, { status: 409 })
      }
      
      update.name = newName
      
      // Update slug
      const slug = newName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
      update.slug = slug
      
      // If category name is being changed, update all products that use the old name
      if (currentCategory.name !== newName) {
        await Product.updateMany(
          { category: currentCategory.name },
          { category: newName }
        )
      }
    }
    
    if (typeof body.isActive === 'boolean') {
      update.isActive = body.isActive
    }
    
    const category = await Category.findByIdAndUpdate(params.id, update, { new: true })
    if (!category) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    
    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const category = await Category.findByIdAndDelete(params.id)
    if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ message: 'Deleted' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}



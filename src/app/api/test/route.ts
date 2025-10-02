import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
   
    
    // Test MongoDB connection
    await connectDB()

    
    return NextResponse.json({ 
      message: 'API is working',
      timestamp: new Date().toISOString(),
      mongodb: 'connected'
    })
  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json({ 
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

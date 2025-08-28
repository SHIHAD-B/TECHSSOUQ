import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, renderWelcomeEmail } from '@/lib/resend'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    
    
    const { email, first_name, last_name, full_name } = await request.json()

   

    // Validate required fields
    if (!email) {
      console.error('Welcome email request missing email')
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Prepare user data for the welcome email
    const userData = {
      email,
      first_name: first_name || '',
      last_name: last_name || '',
      full_name: full_name || ''
    }

 

    // Send welcome email
    try {
      const emailResult = await sendEmail({
        to: email,
        subject: '🎉 Welcome to TECHSSOUQ! Your Account is Ready',
        html: renderWelcomeEmail(userData),
      })

     

      return NextResponse.json(
        { success: true, message: 'Welcome email sent successfully' },
        { status: 200 }
      )
    } catch (emailError: any) {
      console.error('Failed to send welcome email:', emailError)
      console.error('Email error details:', {
        message: emailError?.message,
        name: emailError?.name,
        statusCode: emailError?.statusCode,
        response: emailError?.response?.body
      })
      
      // Return success for the signup process even if email fails
      // This prevents email failures from blocking user registration
      return NextResponse.json(
        { 
          success: true, 
          message: 'Account created successfully, but welcome email could not be sent',
          emailError: emailError.message 
        },
        { status: 200 }
      )
    }
  } catch (error: any) {
    console.error('Welcome email API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

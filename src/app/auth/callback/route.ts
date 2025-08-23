import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, renderLoginEmail } from '@/lib/resend'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.email) {
          // Only send email for new users (signups), not for existing users (signins)
          // Check if user was created in the last few minutes (indicating this is a signup)
          const userCreatedAt = new Date(user.created_at)
          const now = new Date()
          const timeDifference = now.getTime() - userCreatedAt.getTime()
          const isNewUser = timeDifference < 2 * 60 * 1000 // 5 minutes threshold
          
          if (isNewUser) {
            const name = (user.user_metadata?.full_name as string) || (user.user_metadata?.first_name as string)
            await sendEmail({
              to: user.email,
              subject: 'Welcome to TechSouq!',
              html: renderLoginEmail(user.email, name),
            })
          }
        }
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError)
      }
      // Add a cache-busting param so client hooks see the fresh session immediately
      const sep = next.includes('?') ? '&' : '?'
      const refreshed = `${origin}${next}${sep}r=${Date.now()}`
      return NextResponse.redirect(refreshed)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
} 
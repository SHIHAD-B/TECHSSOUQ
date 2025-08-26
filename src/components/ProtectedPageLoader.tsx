'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Loader2, Shield, ArrowRight } from 'lucide-react'
import { redirectToSignIn, hasProtectedPageIntent, getUserIntendedDestination } from '@/lib/auth-utils'

interface ProtectedPageLoaderProps {
  children: React.ReactNode
  pageName?: string
  showLoadingState?: boolean
}

export default function ProtectedPageLoader({ 
  children, 
  pageName = 'this page',
  showLoadingState = true 
}: ProtectedPageLoaderProps) {
  const { user, loading: authLoading, initialized } = useAuth()
  const router = useRouter()
  const [showRedirectPrompt, setShowRedirectPrompt] = useState(false)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (!authLoading && initialized) {
      if (!user) {
        // Check if user was trying to access a protected page
        if (hasProtectedPageIntent()) {
          setShowRedirectPrompt(true)
          // Start countdown before redirect
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer)
                redirectToSignIn(router, { userIntent: `access_${pageName.toLowerCase().replace(/\s+/g, '_')}` })
                return 0
              }
              return prev - 1
            })
          }, 1000)
          
          return () => clearInterval(timer)
        } else {
          // No specific intent, redirect immediately
          redirectToSignIn(router, { userIntent: `access_${pageName.toLowerCase().replace(/\s+/g, '_')}` })
        }
      }
    }
  }, [authLoading, initialized, user, router, pageName])

  // Show loading state while authentication is being determined
  if (authLoading || !initialized) {
    if (!showLoadingState) return null
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-amber-400 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-300 text-lg">Verifying your session...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we check your authentication</p>
        </div>
      </div>
    )
  }

  // Show redirect prompt with countdown
  if (showRedirectPrompt && !user) {
    const intendedDestination = getUserIntendedDestination()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <Shield className="w-16 h-16 text-amber-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-300 mb-6">
            You need to sign in to access {pageName}. 
            {intendedDestination !== '/' && (
              <span className="block mt-2 text-sm text-gray-400">
                You'll be redirected back here after signing in.
              </span>
            )}
          </p>
          
          <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
            <p className="text-gray-300 text-sm mb-2">Redirecting to sign-in in:</p>
            <p className="text-2xl font-bold text-amber-400">{countdown} seconds</p>
          </div>
          
          <button
            onClick={() => redirectToSignIn(router, { userIntent: `access_${pageName.toLowerCase().replace(/\s+/g, '_')}` })}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
          >
            Sign In Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  // User is authenticated, show the protected content
  if (user) {
    return <>{children}</>
  }

  // Fallback - should not reach here
  return null
}

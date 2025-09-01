'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

export default function GlobalLoading() {
  const { loading, initialized } = useAuth()

  // Only show loading if we're still determining authentication state
  if (!loading || initialized) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-400 border-t-transparent mx-auto mb-4"></div>
        <p className="text-white text-lg font-medium">Loading...</p>
        <p className="text-gray-400 text-sm mt-2">Please wait while we verify your session</p>
      </div>
    </div>
  )
}

'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createSupabaseClient } from '@/lib/supabase'
import { useToast } from './ToastContext'
import { useSession } from '@/components/SessionProvider'

interface AuthContextType {
  user: User | null
  loading: boolean
  initialized: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, userData?: any) => Promise<any>
  signInWithGoogle: () => Promise<any>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<any>
  updateProfile: (userData: any) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper function to extract names from email
const extractNamesFromEmail = (email: string) => {
  const localPart = email.split('@')[0]
  
  // Remove common separators and numbers
  const cleanedName = localPart
    .replace(/[0-9]+/g, '') // Remove numbers
    .replace(/[._-]+/g, ' ') // Replace dots, underscores, hyphens with spaces
    .trim()
  
  // Split into words and capitalize each
  const words = cleanedName.split(' ').filter(word => word.length > 0)
  const capitalizedWords = words.map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  )
  
  if (capitalizedWords.length >= 2) {
    return {
      firstName: capitalizedWords[0],
      lastName: capitalizedWords.slice(1).join(' ')
    }
  } else if (capitalizedWords.length === 1) {
    return {
      firstName: capitalizedWords[0],
      lastName: ''
    }
  } else {
    return {
      firstName: 'User',
      lastName: ''
    }
  }
}

// Helper function to get user names with fallback to email extraction
const getUserNames = (user: User) => {
  // First, try to get names from user metadata (Google OAuth provides these)
  let firstName = user.user_metadata?.first_name || ''
  let lastName = user.user_metadata?.last_name || ''
  
  // If no names available, extract from email
  if (!firstName && !lastName && user.email) {
    const extracted = extractNamesFromEmail(user.email)
    firstName = extracted.firstName
    lastName = extracted.lastName
  }
  
  return { firstName, lastName }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { session, user: sessionUser, loading: sessionLoading } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const supabase = createSupabaseClient()
  const { showToast } = useToast()

  // Sync with session from SessionProvider
  useEffect(() => {
    if (sessionUser !== undefined) {
      setUser(sessionUser)
      setInitialized(true)
      setLoading(false)
    }
  }, [sessionUser])

  // Global error handler to prevent stuck states
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)
      // Reset loading state if there's an unhandled error
      setLoading(false)
    }

    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error)
      // Reset loading state if there's a global error
      setLoading(false)
    }



    // Periodic check to prevent stuck loading states
    const loadingCheckInterval = setInterval(() => {
      if (loading && !user) {
        // If we've been loading for a while without a user, reset the state
        const timeSinceLastAction = Date.now() - (window as any).lastAuthAction || 0
        if (timeSinceLastAction > 30000) { // 30 seconds
          console.warn('Loading state stuck for too long, resetting...')
          setLoading(false)
        }
      }
    }, 5000) // Check every 5 seconds

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
      clearInterval(loadingCheckInterval)
    }
  }, [loading, user])

  useEffect(() => {
    let mounted = true

    // Set up auth state change listener for real-time updates
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
     
        
        const currentUser = session?.user ?? null
        
        try {
          // Handle signout events immediately
          if (event === 'SIGNED_OUT') {
            setUser(null)
            return
          }
          
          // If this is a new Google OAuth user without proper name data, update it
          if (event === 'SIGNED_IN' && currentUser && currentUser.app_metadata?.provider === 'google') {
            const { firstName, lastName } = getUserNames(currentUser)
            
            // Check if we need to update the user metadata
            const needsUpdate = !currentUser.user_metadata?.first_name || !currentUser.user_metadata?.last_name
            
            if (needsUpdate && (firstName || lastName)) {
              try {
                await supabase.auth.updateUser({
                  data: {
                    first_name: firstName,
                    last_name: lastName,
                    full_name: `${firstName} ${lastName}`.trim(),
                  }
                })
              } catch (error) {
                console.error('Could not update user metadata:', error)
              }
            }
          }
        } catch (error) {
          console.error('Error handling auth state change:', error)
        }
        
        if (mounted) {
          setUser(currentUser)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
      // Reset loading state on unmount to prevent stuck states
      setLoading(false)
    }
  }, [supabase.auth])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      // Track the last auth action for periodic checks
      ;(window as any).lastAuthAction = Date.now()
      
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (result.error) {
        showToast(result.error.message || 'Sign in failed', 'error')
      }
      return result
    } catch (error) {
      console.error('Sign in error:', error)
      showToast('Sign in failed. Please try again.', 'error')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      setLoading(true)
      
      // Track the last auth action for periodic checks
      ;(window as any).lastAuthAction = Date.now()
      
      // If no userData provided, extract names from email
      let finalUserData = userData
      if (!userData || (!userData.first_name && !userData.last_name)) {
        const { firstName, lastName } = extractNamesFromEmail(email)
        finalUserData = {
          ...userData,
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`.trim(),
        }
      }

      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: finalUserData
        }
      })
     
      return result
    } catch (error) {
      console.error('Sign up error:', error)
      showToast('Sign up failed. Please try again.', 'error')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      const result = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })
      if (result.error) {
        showToast(result.error.message || 'Google sign in failed', 'error')
      } else {
        showToast('Redirecting to Google...', 'info')
      }
      return result
    } catch (error) {
      console.error('Google sign in error:', error)
      showToast('Google sign in failed. Please try again.', 'error')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      
      // Track the last auth action for periodic checks
      ;(window as any).lastAuthAction = Date.now()
      
      // Clear user state immediately to prevent race conditions
      setUser(null)
      
      // Check network status before attempting signout
      if (!navigator.onLine) {
        console.warn('Network is offline, user logged out locally')
        showToast('Signed out successfully! (offline mode)', 'success')
        return
      }
      
      // Retry mechanism for network issues
      let retryCount = 0
      const maxRetries = 2
      let lastError = null
      
      while (retryCount <= maxRetries) {
        try {
          // Add timeout to prevent infinite loading, but handle it gracefully
          const signOutPromise = supabase.auth.signOut()
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Sign out timeout')), 15000) // Increased to 15 seconds
          )
          
          // Race between signout and timeout
          const { error } = await Promise.race([signOutPromise, timeoutPromise]) as any
          
          if (error) {
            lastError = error
            throw error
          } else {
            break
          }
        } catch (error) {
          lastError = error
          
          // Handle timeout gracefully - user is already logged out locally
          if (error instanceof Error && error.message === 'Sign out timeout') {
            console.warn(`Sign out attempt ${retryCount + 1} timed out, but user is logged out locally`)
            
            if (retryCount < maxRetries) {
              // Wait before retry with exponential backoff
              const delay = Math.pow(2, retryCount) * 1000 // 1s, 2s, 4s
             
              await new Promise(resolve => setTimeout(resolve, delay))
              retryCount++
              continue
            } else {
              // Max retries reached, show success message
              showToast('Signed out successfully! (took longer than expected)', 'success')
              break
            }
          } else {
            // Other errors, don't retry
            throw error
          }
        }
      }
      
      // Force clear any remaining session data
      try {
        await supabase.auth.refreshSession()
      } catch (refreshError) {
        // Ignore refresh errors during signout
        console.error('Session refresh during signout:', refreshError)
      }
      
    } catch (error) {
      console.error('Sign out error:', error)
      showToast('Sign out failed. Please try again.', 'error')
      // Ensure user state is cleared even on error
      setUser(null)
    } finally {
      // Always clear loading state, even if there are unexpected errors
      try {
        setLoading(false)
      } catch (cleanupError) {
        console.error('Error clearing loading state:', cleanupError)
        // Force reset loading state
        setLoading(false)
      }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setLoading(true)
      const result = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      
      return result
    } catch (error) {
      console.error('Reset password error:', error)
      showToast('Password reset failed. Please try again.', 'error')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (userData: any) => {
    try {
      setLoading(true)
      const result = await supabase.auth.updateUser({
        data: userData
      })
      if (result.error) {
        showToast(result.error.message || 'Profile update failed', 'error')
      } else {
        showToast('Profile updated successfully!', 'success')
      }
      return result
    } catch (error) {
      console.error('Update profile error:', error)
      showToast('Profile update failed. Please try again.', 'error')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading: loading || sessionLoading || !initialized,
    initialized,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 
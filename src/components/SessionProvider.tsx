'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Models } from 'appwrite'
import { account } from '@/lib/appwrite'

type AppwriteUser = Models.User<Models.Preferences>
type AppwriteSession = Models.Session

interface SessionContextType {
  session: AppwriteSession | null
  user: AppwriteUser | null
  loading: boolean
  initialized: boolean
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  user: null,
  loading: true,
  initialized: false,
})

export function SessionProvider({ 
  children, 
  initialSession,
  initialUser
}: { 
  children: React.ReactNode
  initialSession?: AppwriteSession | null
  initialUser?: AppwriteUser | null
}) {
  const [session, setSession] = useState<AppwriteSession | null>(initialSession || null)
  const [user, setUser] = useState<AppwriteUser | null>(initialUser || null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    let mounted = true

    // If we have initial data, we're already hydrated
    if (initialSession && initialUser) {
      setLoading(false)
      setInitialized(true)
      return
    }

    // Get initial session and user
    const getInitialSession = async () => {
      try {
        setLoading(true)
        const currentUser = await account.get()
        
        if (mounted && currentUser) {
          setUser(currentUser)
          // Since we have a user, we implicitly have a session
          setSession({} as AppwriteSession) // Appwrite doesn't expose session details in client SDK
        }
      } catch (error) {
        // User is not logged in
        if (mounted) {
          setSession(null)
          setUser(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    // Add a small delay to prevent immediate flickering
    const timer = setTimeout(() => {
      getInitialSession()
    }, 100)

    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [initialSession, initialUser])

  return (
    <SessionContext.Provider value={{ session, user, loading, initialized }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}

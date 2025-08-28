/**
 * Enhanced authentication utility functions for handling redirects, return URLs, and user context preservation
 */

/**
 * Stores the current page context for better user experience
 */
export const storePageContext = (pageData: {
  path: string
  search?: string
  timestamp: number
  userIntent?: string
}) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('pageContext', JSON.stringify(pageData))
  }
}

/**
 * Gets the stored page context
 */
export const getPageContext = () => {
  if (typeof window !== 'undefined') {
    const context = sessionStorage.getItem('pageContext')
    return context ? JSON.parse(context) : null
  }
  return null
}

/**
 * Clears the stored page context
 */
export const clearPageContext = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('pageContext')
  }
}

/**
 * Enhanced redirect to sign-in that preserves full context
 */
export const redirectToSignIn = (router: any, additionalContext?: any) => {
  if (typeof window !== 'undefined') {
    // Store comprehensive page context
    const currentPath = window.location.pathname + window.location.search
    const context = {
      path: currentPath,
      search: window.location.search,
      timestamp: Date.now(),
      userIntent: additionalContext?.userIntent || 'access_protected_page',
      ...additionalContext
    }
    
    // Store in session storage
    sessionStorage.setItem('returnUrl', currentPath)
    sessionStorage.setItem('pageContext', JSON.stringify(context))
    
    // Also store in localStorage for persistence across browser sessions
    localStorage.setItem('lastProtectedPage', currentPath)
    
    // Redirect to sign-in
    router.push('/sign-in')
  }
}

/**
 * Gets the stored return URL and removes it from storage
 */
export const getAndClearReturnUrl = (): string | null => {
  if (typeof window !== 'undefined') {
    const returnUrl = sessionStorage.getItem('returnUrl')
    if (returnUrl) {
      sessionStorage.removeItem('returnUrl')
      return returnUrl
    }
    
    // Fallback to localStorage if session storage is empty
    const lastProtectedPage = localStorage.getItem('lastProtectedPage')
    if (lastProtectedPage) {
      localStorage.removeItem('lastProtectedPage')
      return lastProtectedPage
    }
  }
  return null
}

/**
 * Sets a return URL for the current page
 */
export const setReturnUrl = (url: string) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('returnUrl', url)
    localStorage.setItem('lastProtectedPage', url)
  }
}

/**
 * Clears any stored return URL
 */
export const clearReturnUrl = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('returnUrl')
    localStorage.removeItem('lastProtectedPage')
  }
}

/**
 * Checks if user was trying to access a protected page
 */
export const hasProtectedPageIntent = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!(sessionStorage.getItem('returnUrl') || localStorage.getItem('lastProtectedPage'))
  }
  return false
}

/**
 * Gets the user's intended destination with fallbacks
 */
export const getUserIntendedDestination = (): string => {
  if (typeof window !== 'undefined') {
    // Priority: session storage > localStorage > default
    const sessionReturn = sessionStorage.getItem('returnUrl')
    if (sessionReturn) return sessionReturn
    
    const localReturn = localStorage.getItem('lastProtectedPage')
    if (localReturn) return localReturn
    
    // Default to home if no specific destination
    return '/'
  }
  return '/'
}

/**
 * Enhanced authentication state management
 */
export const manageAuthState = {
  // Store user's current activity
  setUserActivity: (activity: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('userActivity', activity)
      sessionStorage.setItem('activityTimestamp', Date.now().toString())
    }
  },
  
  // Get user's last activity
  getUserActivity: () => {
    if (typeof window !== 'undefined') {
      return {
        activity: sessionStorage.getItem('userActivity'),
        timestamp: sessionStorage.getItem('activityTimestamp')
      }
    }
    return { activity: null, timestamp: null }
  },
  
  // Clear user activity
  clearUserActivity: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('userActivity')
      sessionStorage.removeItem('activityTimestamp')
    }
  }
}

/**
 * Redirect to a specific page with optional delay
 */
export const redirectToPage = (path: string, delay: number = 1000) => {
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      window.location.href = path
    }, delay)
  }
}

/**
 * Redirect to home page
 */
export const redirectToHome = (delay: number = 1000) => {
  redirectToPage('/', delay)
}

/**
 * Redirect to sign-in page
 */
export const redirectToSignInPage = (delay: number = 1000) => {
  redirectToPage('/sign-in', delay)
}

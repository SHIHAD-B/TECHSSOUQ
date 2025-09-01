/**
 * Appwrite utility functions for better error handling and user management
 */

import { account, ID } from './appwrite'
import { Models } from 'appwrite'

type AppwriteUser = Models.User<Models.Preferences>

/**
 * Enhanced account creation with better error handling
 */
export const createUserAccount = async (
  email: string, 
  password: string, 
  name: string,
  userData?: any
): Promise<{ user: AppwriteUser; error: null } | { user: null; error: any }> => {
  try {
    // Create account with Appwrite
    const userId = ID.unique()
    const user = await account.create(userId, email, password, name)
    
    // Update user preferences with additional data if provided
    if (userData) {
      try {
        await account.updatePrefs({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          full_name: userData.full_name || name,
          ...userData
        })
      } catch (prefError) {
        console.warn('Could not update user preferences:', prefError)
        // Continue even if preferences fail
      }
    }
    
    return { user, error: null }
  } catch (error: any) {
    console.error('Account creation error:', error)
    
    // Handle specific Appwrite errors
    if (error.code === 409) {
      return { 
        user: null, 
        error: { 
          code: 409, 
          message: 'An account with this email already exists. Please sign in instead.' 
        } 
      }
    } else if (error.code === 400) {
      return { 
        user: null, 
        error: { 
          code: 400, 
          message: 'Invalid email or password format. Please check your input.' 
        } 
      }
    } else if (error.code === 401) {
      return { 
        user: null, 
        error: { 
          code: 401, 
          message: 'Authentication failed. Please check your Appwrite configuration.' 
        } 
      }
    }
    
    return { 
      user: null, 
      error: { 
        code: error.code || 500, 
        message: error.message || 'Account creation failed. Please try again.' 
      } 
    }
  }
}

/**
 * Create session and verify user can sign in
 */
export const createUserSession = async (
  email: string, 
  password: string
): Promise<{ user: AppwriteUser; error: null } | { user: null; error: any }> => {
  try {
    // Create email session
    await account.createEmailPasswordSession(email, password)
    
    // Get user data
    const user = await account.get()
    return { user, error: null }
  } catch (error: any) {
    console.error('Session creation error:', error)
    
    if (error.code === 401) {
      return { 
        user: null, 
        error: { 
          code: 401, 
          message: 'Invalid email or password. Please check your credentials.' 
        } 
      }
    }
    
    return { 
      user: null, 
      error: { 
        code: error.code || 500, 
        message: error.message || 'Sign in failed. Please try again.' 
      } 
    }
  }
}

/**
 * Send verification email with proper error handling
 */
export const sendVerificationEmail = async (
  redirectUrl: string
): Promise<{ success: boolean; error: any }> => {
  try {
    await account.createVerification(redirectUrl)
    return { success: true, error: null }
  } catch (error: any) {
    console.error('Verification email error:', error)
    return { 
      success: false, 
      error: { 
        code: error.code || 500, 
        message: error.message || 'Failed to send verification email.' 
      } 
    }
  }
}

/**
 * Check if user is verified
 */
export const isUserVerified = (user: AppwriteUser): boolean => {
  return user.emailVerification === true
}

/**
 * Get user-friendly error message
 */
export const getUserFriendlyErrorMessage = (error: any): string => {
  if (error.code === 409) {
    return 'An account with this email already exists. Please sign in instead.'
  } else if (error.code === 400) {
    return 'Invalid email or password format. Please check your input.'
  } else if (error.code === 401) {
    return 'Authentication failed. Please check your credentials.'
  } else if (error.code === 403) {
    return 'Access denied. You may not have permission to perform this action.'
  } else if (error.message) {
    return error.message
  }
  
  return 'An unexpected error occurred. Please try again.'
}

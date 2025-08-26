import { Client, Account, Databases, Storage, ID } from 'appwrite'

const appwriteUrl = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!
const appwriteProjectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!

// Server-side Appwrite client for use in Server Components, API routes, etc.
export const createAppwriteServerClient = () => {
  const client = new Client()
    .setEndpoint(appwriteUrl)
    .setProject(appwriteProjectId)

  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client)
  }
}

// Helper function to validate user ID
// For now, we'll trust the user ID from the frontend since Appwrite sessions are client-side
// In production, you might want to implement a more secure validation method
export const validateUserId = async (userId: string): Promise<boolean> => {
  try {
    // For now, just validate that the user ID is a valid format
    // In a production environment, you might want to:
    // 1. Store session tokens in a secure database
    // 2. Validate against stored sessions
    // 3. Use JWT tokens with expiration
    
    if (!userId || typeof userId !== 'string' || userId.length < 10) {
      return false
    }
    
    // Basic validation - you can enhance this based on your security requirements
    return true
  } catch (error) {
    console.error('Error validating user ID:', error)
    return false
  }
}

// Helper function to set session cookie (kept for future use)
export const setSessionCookie = (session: string) => {
  // This would be used if implementing server-side session management
  
}

// Helper function to clear session cookie (kept for future use)
export const clearSessionCookie = () => {
  // This would be used if implementing server-side session management

}

export const AUTH_ERROR_MESSAGES = {
  user_already_exists: 'This email is already registered. Please sign in instead.',
  invalid_credentials: 'Invalid email or password. Please try again.',
  weak_password: 'Password must be at least 8 characters long.',
  email_taken: 'This email address is already in use.',
  default: 'An unexpected error occurred. Please try again.',
} as const;

export function getAuthErrorMessage(error: any): string {
  if (!error) return AUTH_ERROR_MESSAGES.default;
  
  if (typeof error === 'string') {
    return error;
  }
  
  // Check for duplicate email
  if (error.message?.includes('already exists') || 
      error.message === 'User already registered' ||
      error.code === '23505') {
    return AUTH_ERROR_MESSAGES.email_taken;
  }
  
  // Check for invalid credentials
  if (error.message?.includes('Invalid login credentials')) {
    return AUTH_ERROR_MESSAGES.invalid_credentials;
  }

  return error.message || AUTH_ERROR_MESSAGES.default;
}
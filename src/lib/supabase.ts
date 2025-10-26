import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with security enhancements
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
    debug: false
  },
  global: {
    headers: {
      'X-Client-Info': 'sonz-of-thunder-svc',
      'X-Client-Version': '1.0.0'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  // Request timeout handled by default Supabase client
});

// Add auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
    // Clear any cached data
    localStorage.removeItem('supabase.auth.token');
    
    // Reload the page to clear any cached state
    window.location.reload();
  }
});

// Add error event listener
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('Failed to fetch')) {
    console.error('Supabase connection error:', event.reason);
    // You could show a user-friendly error message here
  }
});

// Add online/offline detection
window.addEventListener('online', () => {
  console.log('Connection restored');
  // Reload data when connection is restored
  window.location.reload();
});

window.addEventListener('offline', () => {
  console.log('Connection lost');
  // You could show a user-friendly error message here
});
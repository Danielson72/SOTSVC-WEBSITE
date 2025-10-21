import { createClient } from '@supabase/supabase-js';
import { checkRateLimit } from './rateLimit';

export async function authenticateUser(
  email: string,
  password: string,
  supabase: ReturnType<typeof createClient>
) {
  try {
    // Check rate limiting
    const isRateLimited = await checkRateLimit(email, supabase);
    if (isRateLimited) {
      throw new Error('Too many login attempts. Please try again later.');
    }

    // Attempt authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Log successful login
    await supabase.from('auth_logs').insert([
      {
        user_id: data.user.id,
        action: 'login',
        ip_address: 'client-side', // In production, this would be handled server-side
        user_agent: navigator.userAgent,
      },
    ]);

    return data;
  } catch (error) {
    // Log failed attempt
    await supabase.from('auth_logs').insert([
      {
        email,
        action: 'failed_login',
        ip_address: 'client-side',
        user_agent: navigator.userAgent,
      },
    ]);
    throw error;
  }
}
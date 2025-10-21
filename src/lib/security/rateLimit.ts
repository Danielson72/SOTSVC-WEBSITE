import { createClient } from '@supabase/supabase-js';

const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_REQUESTS_PER_WINDOW = 100;

export async function checkRateLimit(userId: string, supabase: ReturnType<typeof createClient>) {
  const now = new Date();
  const windowStart = new Date(now.getTime() - WINDOW_SIZE_IN_SECONDS * 1000);

  const { count } = await supabase
    .from('request_logs')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .gte('timestamp', windowStart.toISOString());

  return count !== null && count >= MAX_REQUESTS_PER_WINDOW;
}
// Server-side Supabase client (service role — bypasses RLS).
// Used by /api/subscribe, /api/unsubscribe, /api/send-reminders.

import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

export const adminClient = url && serviceKey
  ? createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      db: { schema: 'prayup' },
    })
  : null;

// Verifies the user's JWT by calling Supabase's auth endpoint. Returns the
// user id or null. Uses anon key to instantiate, then validates the token.
export async function getUserFromToken(token: string | undefined): Promise<string | null> {
  if (!token || !url || !anonKey) return null;
  const tmp = createClient(url, anonKey, { auth: { persistSession: false } });
  const { data } = await tmp.auth.getUser(token);
  return data.user?.id ?? null;
}

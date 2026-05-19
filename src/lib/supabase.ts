// Supabase client. The prayup schema lives on the shared Bylined project.
// db.schema='prayup' makes every .from() query target prayup.<table>.

import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseEnabled = !!(url && key);

export const supabase = supabaseEnabled
  ? createClient(url!, key!, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      db: { schema: 'prayup' },
    })
  : null;

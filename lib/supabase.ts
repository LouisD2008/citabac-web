'use client';

<<<<<<< HEAD
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazily create the client on first use. This avoids running createClient()
// during Next.js's build-time prerender, where the env vars aren't needed
// and the browser-only client has no business being instantiated.
let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  if (!url || !anonKey) {
    throw new Error(
      'Supabase env vars manquantes. Vérifie NEXT_PUBLIC_SUPABASE_URL et ' +
        'NEXT_PUBLIC_SUPABASE_ANON_KEY dans les variables Cloudflare Pages.',
    );
  }

  _client = createClient(url, anonKey, {
    auth: { persistSession: false },
  });
  return _client;
}
=======
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
});
>>>>>>> 5369747a648835d1218998dbd1be46a1cd33c3cf

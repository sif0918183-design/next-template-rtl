import 'server-only';
import { createClient } from '@supabase/supabase-js';

// Extremely sensitive admin client using SUPABASE_SERVICE_ROLE_KEY.
// MUST NOT be imported into any Client Components.
export function createAdminClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl || !serviceRoleKey) {
    // Return dummy/unconfigured fallback client if environment variables are empty during SSG/build
    return createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: { persistSession: false },
    });
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

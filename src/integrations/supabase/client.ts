// Supabase client — points at user-owned project dshnnvnhqnrdmlqwsbgb.
// Publishable (anon) key is safe to ship in the client bundle.
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dshnnvnhqnrdmlqwsbgb.supabase.co';
const SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_XQ5-6Pou7Ip9hgsYRd6Lyw_8ID3fKjP';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

const hasValidEnv = isNonEmptyString(SUPABASE_URL) && isNonEmptyString(SUPABASE_ANON_KEY);

// Create a real client when env is configured; otherwise provide a minimal mock
export const supabase: any = hasValidEnv
  ? createClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string)
  : {
      auth: {
        async getUser() {
          return { data: { user: null }, error: null };
        },
        async getSession() {
          return { data: { session: null }, error: null };
        },
        onAuthStateChange(_cb: any) {
          return { data: { subscription: { unsubscribe() {} } }, error: null };
        },
        async signOut() {
          return { error: null };
        },
        async signInWithOAuth() {
          return { data: null, error: new Error('Supabase env is not configured') };
        },
      },
      from() {
        const mockQuery: any = {
          select() { return mockQuery; },
          eq() { return mockQuery; },
          order() { return mockQuery; },
          limit() { return mockQuery; },
          not() { return mockQuery; },
          then(resolve: any) { return resolve({ data: null, error: new Error('Supabase env is not configured') }); },
          catch() { return mockQuery; },
        };
        return mockQuery;
      },
    };

if (!hasValidEnv) {
  // eslint-disable-next-line no-console
  console.warn('[Supabase] SUPABASE_URL and/or SUPABASE_ANON_KEY are not set. Using mock client.');
}
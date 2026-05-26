import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase env vars:', {
    url: supabaseUrl ? '✓ present' : '✗ MISSING',
    key: supabaseAnonKey ? '✓ present' : '✗ MISSING'
  });
  throw new Error('Missing Supabase environment variables. Check frontend/.env file.');
}

// Validate anon key format (should be a JWT with 3 parts)
if (!supabaseAnonKey.includes('.') || supabaseAnonKey.split('.').length !== 3) {
  console.error('❌ Invalid Supabase anon key format. Expected JWT with 3 parts (header.payload.signature)');
  console.error('Current key:', supabaseAnonKey.substring(0, 50) + '...');
  throw new Error('Invalid Supabase anon key format. Get the full key from Supabase dashboard.');
}

console.log('✓ Supabase client initialized:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

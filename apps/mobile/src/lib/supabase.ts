import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/**
 * True when the app has been configured with Supabase credentials.
 * The app is fully usable without them — accounts are optional
 * (ADR 0007) — so every call site must handle this being false.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured && __DEV__) {
  console.warn(
    '[supabase] Missing EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Copy .env.example to apps/mobile/.env. Account features are disabled until then.',
  );
}

/**
 * False during Expo's static web render, which runs in Node where there
 * is no `window` and therefore no storage to persist a session into.
 * Touching AsyncStorage there crashes the export, so session handling is
 * enabled only where a real client runtime exists (native and browser).
 */
const hasClientRuntime = typeof window !== 'undefined';

export const supabase = createClient(supabaseUrl ?? 'http://localhost', supabaseAnonKey ?? 'anon', {
  auth: {
    // Sessions live in AsyncStorage so sign-in survives app restarts.
    ...(hasClientRuntime ? { storage: AsyncStorage } : {}),
    autoRefreshToken: hasClientRuntime,
    persistSession: hasClientRuntime,
    // Native apps never parse the session out of a URL fragment.
    detectSessionInUrl: false,
  },
});

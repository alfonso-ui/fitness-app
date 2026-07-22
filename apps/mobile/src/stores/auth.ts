import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';

/** Result shape every auth action returns: null error means success. */
export type AuthResult = { error: string | null };

type AuthState = {
  session: Session | null;
  user: User | null;
  /** False until the stored session has been read; screens wait on it. */
  ready: boolean;
  /** Set after sign-up when the account still needs email confirmation. */
  pendingConfirmationEmail: string | null;

  initialize: () => () => void;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<AuthResult>;
  clearPendingConfirmation: () => void;
};

/** Supabase errors are developer-facing; keep the user-facing text plain. */
function readableError(message: string): string {
  if (/invalid login credentials/i.test(message)) return 'That email or password is not correct.';
  if (/email not confirmed/i.test(message)) {
    return 'Please confirm your email address first — check your inbox.';
  }
  if (/user already registered/i.test(message)) {
    return 'An account with that email already exists. Try signing in instead.';
  }
  if (/password should be at least/i.test(message)) {
    return 'Please choose a password of at least 6 characters.';
  }
  if (/unable to validate email/i.test(message)) return 'Please enter a valid email address.';
  return message;
}

const NOT_CONFIGURED: AuthResult = {
  error: 'Accounts are not set up in this build yet.',
};

export const useAuthStore = create<AuthState>()((set) => ({
  session: null,
  user: null,
  ready: false,
  pendingConfirmationEmail: null,

  initialize: () => {
    if (!isSupabaseConfigured) {
      set({ ready: true });
      return () => {};
    }

    supabase.auth
      .getSession()
      .then(({ data }) => {
        set({ session: data.session, user: data.session?.user ?? null, ready: true });
      })
      .catch(() => set({ ready: true }));

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, ready: true });
    });

    return () => data.subscription.unsubscribe();
  },

  signUp: async (email, password) => {
    if (!isSupabaseConfigured) return NOT_CONFIGURED;
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
    if (error) return { error: readableError(error.message) };
    // With email confirmation on, Supabase returns a user but no session.
    if (!data.session) set({ pendingConfirmationEmail: email.trim() });
    return { error: null };
  },

  signIn: async (email, password) => {
    if (!isSupabaseConfigured) return NOT_CONFIGURED;
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return { error: error ? readableError(error.message) : null };
  },

  signOut: async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    set({ session: null, user: null });
  },

  sendPasswordReset: async (email) => {
    if (!isSupabaseConfigured) return NOT_CONFIGURED;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    return { error: error ? readableError(error.message) : null };
  },

  clearPendingConfirmation: () => set({ pendingConfirmationEmail: null }),
}));

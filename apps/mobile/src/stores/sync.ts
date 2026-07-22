import { useEffect } from 'react';
import { create } from 'zustand';

import { type SyncOutcome, syncAll } from '@/lib/sync';
import { useAuthStore } from '@/stores/auth';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'unavailable' | 'error';

type SyncState = {
  status: SyncStatus;
  lastSyncedAt: string | null;
  lastOutcome: SyncOutcome | null;
  syncNow: (userId: string | undefined) => Promise<void>;
};

function statusFor(outcome: SyncOutcome): SyncStatus {
  switch (outcome) {
    case 'ok':
      return 'synced';
    case 'error':
      return 'error';
    case 'not-provisioned':
      return 'unavailable';
    default:
      // not-configured / signed-out: nothing to sync, stay quiet.
      return 'idle';
  }
}

// Not persisted: sync status is transient and recomputed each launch,
// so this store never touches AsyncStorage (safe for static rendering).
export const useSyncStore = create<SyncState>()((set, get) => ({
  status: 'idle',
  lastSyncedAt: null,
  lastOutcome: null,

  syncNow: async (userId) => {
    if (get().status === 'syncing') return;
    set({ status: 'syncing' });
    const outcome = await syncAll(userId);
    set({
      status: statusFor(outcome),
      lastOutcome: outcome,
      lastSyncedAt: outcome === 'ok' ? new Date().toISOString() : get().lastSyncedAt,
    });
  },
}));

/**
 * Kicks off a sync whenever a user becomes signed in. Mounted once at the
 * app root. Manual "Sync now" from Profile calls the same action.
 */
export function useAutoSync(): void {
  const userId = useAuthStore((state) => state.user?.id);
  const syncNow = useSyncStore((state) => state.syncNow);

  useEffect(() => {
    if (userId) void syncNow(userId);
  }, [userId, syncNow]);
}

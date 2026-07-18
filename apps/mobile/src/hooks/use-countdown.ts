import { useEffect, useState } from 'react';

function remainingSeconds(endsAt: string | null): number {
  if (!endsAt) return 0;
  return Math.max(0, Math.ceil((Date.parse(endsAt) - Date.now()) / 1000));
}

/**
 * Seconds left until `endsAt`, recomputed from the timestamp on every
 * tick. Because it derives from an absolute time (not an accumulating
 * counter), it stays correct across backgrounding and reloads.
 */
export function useCountdown(endsAt: string | null): number {
  const [remaining, setRemaining] = useState(() => remainingSeconds(endsAt));

  useEffect(() => {
    setRemaining(remainingSeconds(endsAt));
    if (!endsAt) return;
    const interval = setInterval(() => setRemaining(remainingSeconds(endsAt)), 250);
    return () => clearInterval(interval);
  }, [endsAt]);

  return remaining;
}

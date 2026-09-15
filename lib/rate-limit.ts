/**
 * Rate-limit en memoria — sin dependencia externa.
 * Suficiente para un sitio con tráfico medio. En serverless puede reiniciarse
 * entre invocaciones, pero mitiga bursts de spam sin añadir Redis/Upstash.
 * Si escalas a varios nodos, migrar a Upstash Redis.
 */

type Entry = { count: number; resetAt: number };

const stores = new Map<string, Map<string, Entry>>();

function getStore(namespace: string): Map<string, Entry> {
  let s = stores.get(namespace);
  if (!s) {
    s = new Map();
    stores.set(namespace, s);
  }
  return s;
}

export function checkRateLimit(
  namespace: string,
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const store = getStore(namespace);
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count < limit) {
    entry.count++;
    return { allowed: true };
  }

  return { allowed: false, retryAfterMs: entry.resetAt - now };
}

// Limpieza periódica para no crecer indefinidamente en dev / long-running
if (typeof setInterval !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = globalThis as any;
  if (!g.__takariwa_ratelimit_cleanup) {
    g.__takariwa_ratelimit_cleanup = setInterval(() => {
      const now = Date.now();
      for (const store of stores.values()) {
        for (const [k, v] of store.entries()) {
          if (now > v.resetAt) store.delete(k);
        }
      }
    }, 60_000);
    // No bloquear exit en Node
    if (g.__takariwa_ratelimit_cleanup.unref) g.__takariwa_ratelimit_cleanup.unref();
  }
}

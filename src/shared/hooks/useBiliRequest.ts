import { useCallback, useEffect, useRef, useState } from "@astralsight/astroforge-core";

interface CacheEntry<T> {
  value: T;
  expires: number;
}

interface UseBiliRequestOptions {
  /** 缓存有效期（ms）。0 / 缺省 = 不缓存（每次拉取）。 */
  ttl?: number;
  /** 默认 true：mount 时立即触发。设为 false 时只能通过 refresh() 触发。 */
  immediate?: boolean;
  /** 命中过期缓存时是否先 fallback 展示旧值，再后台刷新。默认 true。 */
  staleWhileRevalidate?: boolean;
}

export interface UseBiliRequestResult<T> {
  data: T | null;
  loading: boolean;
  error: unknown;
  refresh: () => Promise<void>;
}

const cache = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

function fromCache<T>(key: string): T | null {
  const hit = cache.get(key);
  if (!hit) return null;
  if (hit.expires > 0 && hit.expires < Date.now()) return null;
  return hit.value as T;
}

function staleFromCache<T>(key: string): T | null {
  const hit = cache.get(key);
  return hit ? (hit.value as T) : null;
}

export function clearBiliCache(prefix?: string): void {
  if (!prefix) {
    cache.clear();
    return;
  }
  for (const key of Array.from(cache.keys())) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
}

export function useBiliRequest<T>(
  key: string | null,
  fetcher: () => Promise<T>,
  opts: UseBiliRequestOptions = {},
): UseBiliRequestResult<T> {
  const ttl = opts.ttl ?? 0;
  const immediate = opts.immediate !== false;
  const swr = opts.staleWhileRevalidate !== false;

  const [data, setData] = useState<T | null>(() => (key ? fromCache<T>(key) : null));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  // 用 ref 锁定最新的 fetcher，避免在 useEffect deps 里追加导致重复触发
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  // 用 ref 防止页面卸载后还 setState
  const aliveRef = useRef(true);
  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  const run = useCallback(
    async (forceRefresh: boolean): Promise<void> => {
      if (!key) return;

      const hit = !forceRefresh ? fromCache<T>(key) : null;
      if (hit !== null) {
        setData(hit);
        setError(null);
        setLoading(false);
        return;
      }

      // SWR: 先放过期值（如有）顶上，再异步刷新
      if (!forceRefresh && swr) {
        const stale = staleFromCache<T>(key);
        if (stale !== null && data === null) setData(stale);
      }

      setLoading(true);
      setError(null);

      let promise = !forceRefresh ? (inflight.get(key) as Promise<T> | undefined) : undefined;
      if (!promise) {
        promise = (async () => {
          try {
            const v = await fetcherRef.current();
            cache.set(key, { value: v, expires: ttl > 0 ? Date.now() + ttl : 0 });
            return v;
          } finally {
            inflight.delete(key);
          }
        })();
        inflight.set(key, promise);
      }

      try {
        const result = await promise;
        if (!aliveRef.current) return;
        setData(result);
        setError(null);
      } catch (e) {
        if (!aliveRef.current) return;
        setError(e);
      } finally {
        if (aliveRef.current) setLoading(false);
      }
    },
    [key, ttl, swr, data],
  );

  useEffect(() => {
    if (!immediate || !key) return;
    void run(false);
  }, [key, immediate, run]);

  const refresh = useCallback(async () => {
    if (key) cache.delete(key);
    await run(true);
  }, [key, run]);

  return { data, loading, error, refresh };
}

// 极小的 TTL + in-flight dedupe 缓存。
//
// 为什么不用 SWR / react-query：旧版的 React-like 在 AstroForge 里只是一个
// 编译期的源码方言，没有真正的 Suspense / Promise 调度。我们要的能力只是：
// 1) 同一 key 并发请求只发一次；
// 2) 短时间内命中缓存直接返回，避免列表页频繁请求。
//
// 因此一个 Map + 一个 Map 就够了，且总代码量小于 50 行。

interface Entry<T> {
  expiresAt: number;
  value: T;
}

const STORE = new Map<string, Entry<unknown>>();
const INFLIGHT = new Map<string, Promise<unknown>>();

/** 默认 30 秒 TTL，恰好覆盖列表页 / 详情页之间快速来回的窗口。 */
export const defaultTtl = 30_000;

export async function cached<T>(
  key: string,
  loader: () => Promise<T>,
  ttl: number = defaultTtl,
): Promise<T> {
  const now = Date.now();
  const hit = STORE.get(key);
  if (hit && hit.expiresAt > now) {
    return hit.value as T;
  }

  const inflight = INFLIGHT.get(key) as Promise<T> | undefined;
  if (inflight) return inflight;

  const promise = (async () => {
    try {
      const value = await loader();
      STORE.set(key, { value, expiresAt: Date.now() + ttl });
      return value;
    } finally {
      INFLIGHT.delete(key);
    }
  })();
  INFLIGHT.set(key, promise);
  return promise;
}

export function invalidate(prefix?: string) {
  if (!prefix) {
    STORE.clear();
    return;
  }
  for (const key of STORE.keys()) {
    if (key.startsWith(prefix)) STORE.delete(key);
  }
}

export function setCached<T>(key: string, value: T, ttl: number = defaultTtl) {
  STORE.set(key, { value, expiresAt: Date.now() + ttl });
}

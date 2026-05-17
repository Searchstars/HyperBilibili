import { storage } from "@astralsight/astroforge-core";

// 旧版 asyncapi/storage 是把回调风格的 system.storage 包装成 Promise。
// 这里同样的目的，但同时引入 JSON 编解码与默认值，让调用点更短。

export async function storageGet(key: string, fallback?: string): Promise<string | undefined> {
  return new Promise((resolve) => {
    (storage as any).get({
      key,
      default: fallback ?? "",
      success: (data: string) => resolve(data && data.length > 0 ? data : fallback),
      fail: () => resolve(fallback),
    });
  });
}

export async function storageGetJSON<T>(key: string, fallback: T): Promise<T> {
  const raw = await storageGet(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function storageSet(key: string, value: string): Promise<void> {
  return new Promise((resolve, reject) => {
    (storage as any).set({
      key,
      value,
      success: () => resolve(),
      fail: (_: unknown, code: number) => reject(new Error(`storage.set ${key} code=${code}`)),
    });
  });
}

export async function storageSetJSON<T>(key: string, value: T): Promise<void> {
  await storageSet(key, JSON.stringify(value));
}

export async function storageDelete(key: string): Promise<void> {
  return new Promise((resolve) => {
    (storage as any).delete({
      key,
      success: () => resolve(),
      fail: () => resolve(),
    });
  });
}

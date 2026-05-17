import { vela } from "@astralsight/astroforge-core";

// WBI 签名。算法不变，但抽离成纯函数，与请求层解耦，便于单测（在 Node 上替换
// hashDigest 的实现即可）。混淆表来自旧版 utils/utils.ts，已是上游公开常量。

const MIXIN_KEY_TAB = [
  46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
  33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40, 61,
  26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36,
  20, 34, 44, 52,
];

export function mixinKey(orig: string): string {
  return MIXIN_KEY_TAB.map((n) => orig[n]).join("").slice(0, 32);
}

export interface WbiKeys {
  imgKey: string;
  subKey: string;
}

export function deriveWbiKeys(accountInfo: any): WbiKeys {
  const imgUrl: string = accountInfo?.wbi_img?.img_url ?? "";
  const subUrl: string = accountInfo?.wbi_img?.sub_url ?? "";
  const tail = (u: string) => u.split("/").pop()?.split(".")[0] ?? "";
  return { imgKey: tail(imgUrl), subKey: tail(subUrl) };
}

export function signWbi(params: Record<string, unknown>, keys: WbiKeys): string {
  const mk = mixinKey(keys.imgKey + keys.subKey);
  const wts = Math.floor(Date.now() / 1000);
  const merged = { ...params, wts };
  // 字典序拼 query，剥离 ! ' ( ) * 后做 MD5。这一步由 vela.crypto 完成，
  // Vela JS 引擎没有 Web Crypto。
  const query = Object.keys(merged)
    .sort()
    .map((k) => {
      const v = String(merged[k]).replace(/[!'()*]/g, "");
      return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
    })
    .join("&");
  const sig = (vela as any).crypto.hashDigest({
    data: query + mk,
    algo: "MD5",
  });
  return `${query}&w_rid=${sig}`;
}

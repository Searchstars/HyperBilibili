import { network } from "@astralsight/astroforge-core";
import { logger } from "../util/logger";
import { state } from "./state";
import { deriveWbiKeys, signWbi } from "./wbi";

// B 站请求层。对外只暴露 4 个动作：get / getWbi / post / postWbi。
// 这一层不做缓存（缓存在 cache.ts），也不做反序列化（默认 responseType=json）。

interface FetchResult<T = unknown> {
  data?: { data?: T; code?: number; message?: string; [k: string]: unknown };
  headers?: Record<string, string | string[]>;
}

function defaultHeaders(): Record<string, string> {
  // 模拟浏览器以降低风控；旧版 Accept-Encoding 留空避免 gzip 被快应用反复解压。
  return {
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/jxl,image/webp,image/png,image/svg+xml,*/*;q=0.8",
    "Accept-Encoding": "",
    "Accept-Language": "zh-CN,zh;q=0.8",
    Cookie: cookieString(),
    Referer: "https://www.bilibili.com",
    Origin: "https://www.bilibili.com",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0",
  };
}

function cookieString(): string {
  let s = `buvid3=${state.buvid3 ?? ""}; buvid4=${state.buvid4 ?? ""}; `;
  if (state.sessData) {
    s += `SESSDATA=${state.sessData}; bili_jct=${state.biliJct}; DedeUserID=${state.dedeUserID}; sid=${state.sid}; `;
  }
  // 专栏页保持旧版排版（不走 opus）。
  s += "opus-goback=1";
  return s;
}

export async function httpGet<T = any>(url: string, responseType: "json" | "text" | "arraybuffer" = "json"): Promise<T> {
  logger.log("[http] GET", url);
  const resp = await (network as any).fetch({
    url,
    responseType,
    header: defaultHeaders(),
  });
  return (resp as FetchResult).data?.data ?? ((resp as FetchResult).data as T);
}

// `raw` 版本返回外层壳，便于读取 code / message。许多接口需要判断 code === 0。
export async function httpGetRaw<T = any>(url: string): Promise<{ code?: number; message?: string; data?: T }> {
  logger.log("[http] GET raw", url);
  const resp = await (network as any).fetch({
    url,
    responseType: "json",
    header: defaultHeaders(),
  });
  return ((resp as FetchResult).data as any) ?? {};
}

export async function httpPost(
  url: string,
  body: string,
  contentType = "application/x-www-form-urlencoded",
  extraHeaders?: Record<string, string>,
): Promise<any> {
  logger.log("[http] POST", url, body.length, "B");
  const headers = { ...defaultHeaders(), "Content-Type": contentType, ...(extraHeaders ?? {}) };
  const resp = await (network as any).fetch({
    url,
    method: "POST",
    data: body,
    responseType: "json",
    header: headers,
  });
  return (resp as FetchResult).data;
}

export async function httpGetWbi<T = any>(url: string, params: Record<string, unknown>): Promise<T> {
  ensureWbiReady();
  const keys = deriveWbiKeys(state.accountInfo);
  const signed = signWbi(params, keys);
  return httpGet(`${url}?${signed}`);
}

export async function httpGetWbiRaw<T = any>(url: string, params: Record<string, unknown>) {
  ensureWbiReady();
  const keys = deriveWbiKeys(state.accountInfo);
  const signed = signWbi(params, keys);
  return httpGetRaw<T>(`${url}?${signed}`);
}

export async function httpPostWbi(
  url: string,
  wbiParams: Record<string, unknown>,
  body: string,
  contentType = "application/x-www-form-urlencoded",
  extraHeaders?: Record<string, string>,
) {
  ensureWbiReady();
  const keys = deriveWbiKeys(state.accountInfo);
  const signed = signWbi(wbiParams, keys);
  return httpPost(`${url}?${signed}`, body, contentType, extraHeaders);
}

function ensureWbiReady() {
  if (!state.accountInfo?.wbi_img) {
    throw new Error("WBI 不可用：accountInfo 未就绪，需先 ensureLogin()");
  }
}

// 用于响应头中读取 Set-Cookie；Vela 接口将 multi-value header 表示为字符串或
// 字符串数组，这里统一为字符串数组。
export function readSetCookie(headers: Record<string, string | string[]> | undefined): string[] {
  if (!headers) return [];
  const raw = headers["Set-Cookie"] ?? headers["set-cookie"];
  if (!raw) return [];
  return Array.isArray(raw) ? raw : raw.split(", ");
}

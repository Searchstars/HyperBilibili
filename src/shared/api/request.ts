// system.fetch 封装层。
//
// 与旧版 bilibiliclient/api/request.ts 行为完全一致：
//   - 返回的 response 形如 { data, code, headers }，原 `getRequest()` 返回 response.data
//     （即 JSON body），所以业务侧仍然写 `response.data.data.xxx`。
//   - getHeaders() 拼装 Cookie / Referer / UA 等防风控头。
//   - encWbi(params, img, sub) → 字符串，保持原签名规则。
//
// 保留 system.request feature 以兼容某些机型对 system.fetch 的不完整实现，
// 但默认路径走 system.fetch（更稳）。

import { network, velaCrypto } from "@astralsight/astroforge-core";
import { getMixinKey } from "./utils/utils";
import { eula } from "../eula";

export interface BiliResponse<T = any> {
  data: T;
  code?: number;
  headers?: Record<string, string | string[]>;
}

export interface ClientCookies {
  sessData: string | null;
  biliJct: string | null;
  dedeUserID: string | null;
  sid: string | null;
  buvid3: string | null;
  buvid4: string | null;
}

export interface AccountInfo {
  mid?: string;
  wbi_img?: { img_url: string; sub_url: string };
  [k: string]: any;
}

export function buildCookieString(c: ClientCookies): string {
  let cookies = `buvid3=${c.buvid3}; buvid4=${c.buvid4}; `;
  if (c.sessData) {
    cookies += `SESSDATA=${c.sessData}; bili_jct=${c.biliJct}; DedeUserID=${c.dedeUserID}; sid=${c.sid}; `;
  }
  cookies += "opus-goback=1";
  return cookies;
}

export function buildHeaders(c: ClientCookies): Record<string, string> {
  return {
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/jxl,image/webp,image/png,image/svg+xml,*/*;q=0.8",
    "Accept-Encoding": "",
    "Accept-Language": "zh-CN,zh;q=0.8",
    Cookie: buildCookieString(c),
    Referer: "https://www.bilibili.com",
    Origin: "https://www.bilibili.com",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0",
  };
}

export function encWbi(
  params: Record<string, any>,
  img_key: string,
  sub_key: string,
): string {
  const mixin_key = getMixinKey(img_key + sub_key);
  const curr_time = Math.floor(Date.now() / 1000);

  params.wts = curr_time;
  const query = Object.keys(params)
    .sort()
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(
          params[key].toString().replace(/[!'()*]/g, ""),
        )}`,
    )
    .join("&");

  // velaCrypto.hashDigest is sync and returns string (per AstroForge types).
  const wbi_sign = velaCrypto.hashDigest({
    data: query + mixin_key,
    algo: "MD5",
  }) as unknown as string;

  return `${query}&w_rid=${wbi_sign}`;
}

export async function rawGet(
  url: string,
  headers: Record<string, string>,
  responseType: string = "json",
): Promise<BiliResponse> {
  try {
    const response = (await network.fetch({
      url,
      responseType,
      header: headers,
    })) as any;
    return response as BiliResponse;
  } catch (error) {
    console.error("[request] GET failed", url, error);
    return { data: undefined };
  }
}

export async function rawPost(
  url: string,
  data: string,
  headers: Record<string, string>,
  responseType: string = "json",
): Promise<BiliResponse> {
  try {
    const response = (await network.fetch({
      url,
      responseType,
      method: "POST",
      data,
      header: headers,
    })) as any;
    return response as BiliResponse;
  } catch (error) {
    console.error("[request] POST failed", url, error);
    return { data: undefined };
  }
}

export function getEulaShowContent(): string {
  return eula;
}

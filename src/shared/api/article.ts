import { httpGet } from "./http";

// 专栏接口返回 HTML 而非 JSON，调用方再做解析。
export async function article(cvid: string, useNewOpus = true): Promise<string> {
  let url = `https://www.bilibili.com/read/${cvid}`;
  if (!useNewOpus) url += "?jump_opus=1";
  return httpGet<string>(url, "text");
}

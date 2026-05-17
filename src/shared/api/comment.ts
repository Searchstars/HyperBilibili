import { httpGetRaw, httpPost } from "./http";
import { state } from "./state";

export async function getReplies(type: string, oid: string, pn = 1, ps = 10, sort = 1) {
  const raw = await httpGetRaw<any>(
    `https://api.bilibili.com/x/v2/reply?type=${type}&oid=${oid}&pn=${pn}&ps=${ps}&sort=${sort}`,
  );
  return raw?.data;
}

export async function getSecReplies(type: string, oid: string, root: string, pn = 1, ps = 10) {
  const raw = await httpGetRaw<any>(
    `https://api.bilibili.com/x/v2/reply/reply?type=${type}&oid=${oid}&pn=${pn}&ps=${ps}&root=${root}`,
  );
  return raw?.data;
}

export async function likeReply(type: string, oid: string, rpid: string, action: 0 | 1) {
  const body = `type=${type}&oid=${oid}&rpid=${rpid}&action=${action}&csrf=${state.biliJct ?? ""}`;
  return httpPost("https://api.bilibili.com/x/v2/reply/action", body);
}

export async function sendReply(type: string, oid: string, message: string) {
  const body = `type=${type}&oid=${oid}&message=${encodeURIComponent(message)}&plat=1&csrf=${state.biliJct ?? ""}`;
  return httpPost("https://api.bilibili.com/x/v2/reply/add", body);
}

export async function sendSecReply(type: string, oid: string, parent: string, message: string) {
  const body = `type=${type}&oid=${oid}&parent=${parent}&message=${encodeURIComponent(message)}&plat=1&csrf=${state.biliJct ?? ""}`;
  return httpPost("https://api.bilibili.com/x/v2/reply/add", body);
}

export async function sendTreeReply(type: string, oid: string, parent: string, root: string, message: string) {
  const body = `type=${type}&oid=${oid}&parent=${parent}&root=${root}&message=${encodeURIComponent(message)}&plat=1&csrf=${state.biliJct ?? ""}`;
  return httpPost("https://api.bilibili.com/x/v2/reply/add", body);
}

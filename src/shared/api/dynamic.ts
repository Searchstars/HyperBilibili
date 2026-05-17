import { httpGetRaw } from "./http";

export async function dynamicFeed(hostMid: number | string = 0, offset: number | string = 0) {
  let url = "https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all?platform=web";
  if (hostMid) url += `&host_mid=${hostMid}`;
  if (offset) url += `&offset=${offset}`;
  const raw = await httpGetRaw<any>(url);
  return raw?.data;
}

export async function dynamicDetail(id: string) {
  const raw = await httpGetRaw<any>(
    `https://api.bilibili.com/x/polymer/web-dynamic/v1/detail?id=${id}`,
  );
  return raw?.data;
}

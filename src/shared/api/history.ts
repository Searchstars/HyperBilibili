import { httpGetRaw } from "./http";

export async function watchHistory(pn: number, ps: number) {
  const raw = await httpGetRaw<any>(`https://api.bilibili.com/x/v2/history?pn=${pn}&ps=${ps}`);
  return raw?.data;
}

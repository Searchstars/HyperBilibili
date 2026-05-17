import { httpGetRaw, httpGetWbiRaw } from "./http";
import { cached } from "./cache";

export async function userInfo(mid: string | number) {
  return cached(`user:${mid}`, async () => {
    const raw = await httpGetWbiRaw<any>("https://api.bilibili.com/x/space/wbi/acc/info", { mid });
    return raw?.data;
  });
}

export async function userStat(mid: string | number) {
  const raw = await httpGetRaw<any>(`https://api.bilibili.com/x/relation/stat?vmid=${mid}`);
  return raw?.data;
}

export async function userMasterPiece(mid: string | number) {
  const raw = await httpGetRaw<any>(`https://api.bilibili.com/x/space/masterpiece?vmid=${mid}`);
  return raw?.data;
}

export async function userVideos(mid: string | number, pn: number, ps = 5) {
  const raw = await httpGetWbiRaw<any>("https://api.bilibili.com/x/space/wbi/arc/search", { mid, pn, ps });
  return raw?.data;
}

export async function userDynamic(mid: string | number) {
  const raw = await httpGetRaw<any>(`https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?host_mid=${mid}`);
  return raw?.data;
}

export async function userNavnum(mid: string | number) {
  const raw = await httpGetRaw<any>(`https://api.bilibili.com/x/space/navnum?mid=${mid}`);
  return raw?.data;
}

export async function multiUserInfo(mids: Array<string | number>) {
  const param = mids.filter(Boolean).join(",");
  const raw = await httpGetRaw<any>(
    `https://api.bilibili.com/x/polymer/pc-electron/v1/user/cards?uids=${param}`,
  );
  return raw?.data;
}

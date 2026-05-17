import { httpGetRaw } from "./http";
import { cached } from "./cache";

// 收藏夹相关。

export async function getUserFavFolders(mid: string | number, type = 0, rid?: string) {
  let url = `https://api.bilibili.com/x/v3/fav/folder/created/list-all?up_mid=${mid}&type=${type}`;
  if (rid) url += `&rid=${rid}`;
  return cached(`favfolders:${mid}:${type}:${rid ?? ""}`, async () => {
    const raw = await httpGetRaw<any>(url);
    return raw?.data;
  });
}

export async function favFolderMeta(mlid: string | number) {
  const raw = await httpGetRaw<any>(`https://api.bilibili.com/x/v3/fav/folder/info?media_id=${mlid}`);
  return raw?.data;
}

export async function favFolderContent(mlid: string | number, pn: number, ps = 10, keyword?: string) {
  let url = `https://api.bilibili.com/x/v3/fav/resource/list?media_id=${mlid}&ps=${ps}&pn=${pn}`;
  if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
  const raw = await httpGetRaw<any>(url);
  return raw?.data;
}

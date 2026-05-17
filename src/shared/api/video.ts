import { httpGet, httpGetRaw, httpGetWbi, httpGetWbiRaw, httpPost } from "./http";
import { cached } from "./cache";
import { state } from "./state";
import { getUserFavFolders } from "./folder";

// 视频接口。读操作走 cache，写操作直发。函数命名遵循 verb+entity 而非旧版
// 的 getXxxByYyy 长串，调用方更易补全。

export interface VideoInfo {
  bvid: string;
  aid: number;
  cid: number;
  title: string;
  pic: string;
  owner: { mid: number; name: string; face: string };
  stat: { view: number; like: number; coin: number; favorite: number; reply: number; danmaku: number };
  duration: number;
  desc?: string;
  pages?: Array<{ cid: number; page: number; part: string }>;
  [k: string]: unknown;
}

export async function recommendedVideos(freshType = 3, pageSize = 10): Promise<any[]> {
  const url = `https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=${freshType}&ps=${pageSize}&version=1`;
  return cached(`rec:${freshType}:${pageSize}`, async () => {
    const raw = await httpGetRaw<any>(url);
    return raw?.data?.item ?? [];
  }, 15_000);
}

export async function videoInfoByBVID(bvid: string): Promise<VideoInfo> {
  return cached(`vinfo:${bvid}`, async () => {
    const raw = await httpGetRaw<VideoInfo>(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`);
    return raw?.data as VideoInfo;
  });
}

export async function isVideoLiked(bvid: string): Promise<boolean> {
  const raw = await httpGetRaw<number>(`https://api.bilibili.com/x/web-interface/archive/has/like?bvid=${bvid}`);
  return Boolean(raw?.data);
}

export async function isVideoCoined(bvid: string): Promise<boolean> {
  const raw = await httpGetRaw<{ multiply: number }>(`https://api.bilibili.com/x/web-interface/archive/coins?bvid=${bvid}`);
  return Boolean(raw?.data?.multiply);
}

export async function isVideoStared(bvid: string): Promise<boolean> {
  const raw = await httpGetRaw<{ favoured: boolean }>(`https://api.bilibili.com/x/v2/fav/video/favoured?aid=${bvid}`);
  return Boolean(raw?.data?.favoured);
}

export async function videoAISummary(bvid: string, cid: string | number, upMid: string | number): Promise<string> {
  const raw = await httpGetWbiRaw<any>("https://api.bilibili.com/x/web-interface/view/conclusion/get", { bvid, cid, up_mid: upMid });
  return raw?.data?.model_result?.summary ?? "";
}

export async function likeVideo(bvid: string, like: 0 | 1) {
  const body = `bvid=${bvid}&like=${like}&csrf=${state.biliJct ?? ""}`;
  return httpPost("https://api.bilibili.com/x/web-interface/archive/like", body);
}

export async function coinVideo(bvid: string, multiply: 1 | 2) {
  const body = `bvid=${bvid}&multiply=${multiply}&csrf=${state.biliJct ?? ""}`;
  return httpPost("https://api.bilibili.com/x/web-interface/coin/add", body);
}

export async function starVideoToDefault(bvid: string) {
  if (!state.accountInfo?.mid) return false;
  const folders = await getUserFavFolders(state.accountInfo.mid);
  const def = folders?.list?.find((f: any) => f.title === "默认收藏夹");
  if (!def) return false;
  try {
    const info = await videoInfoByBVID(bvid);
    const body = `rid=${info.aid}&csrf=${state.biliJct ?? ""}&type=2&add_media_ids=${def.id}&del_media_ids=`;
    const resp = await httpPost("https://api.bilibili.com/x/v3/fav/resource/deal", body);
    return resp?.code === 0;
  } catch {
    return false;
  }
}

/** 选最佳音轨。player.ux 已删，仅在背景音 / 推荐预听等小场景下保留。 */
export async function bestAudioUrl(bvid: string): Promise<string | undefined> {
  const info = await videoInfoByBVID(bvid);
  const cid = info.cid ?? info.pages?.[0]?.cid;
  if (!cid) return undefined;
  const raw = await httpGetWbiRaw<any>("https://api.bilibili.com/x/player/wbi/playurl", {
    bvid,
    cid,
    fnval: 4048,
    fourk: 1,
    platform: "pc",
  });
  const audio: any[] = raw?.data?.dash?.audio ?? [];
  if (!audio.length) return undefined;
  audio.sort((a, b) => (b.bandwidth ?? 0) - (a.bandwidth ?? 0));
  return audio[0]?.baseUrl ?? audio[0]?.base_url;
}

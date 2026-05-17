import { httpGetRaw, httpGetWbiRaw } from "./http";
import { logger } from "../util/logger";

export async function searchHotwords(): Promise<any[]> {
  const raw = await httpGetRaw<any>("https://s.search.bilibili.com/main/hotword");
  // 该接口返回根字段就叫 list，不在 data 里。
  return (raw as any)?.list ?? [];
}

export interface SearchResult {
  users: any[];
  videos: any[];
  comprehensiveVideos: any[];
}

export async function searchAll(keyword: string, vidCount = 20): Promise<SearchResult> {
  const raw = await httpGetWbiRaw<any>("https://api.bilibili.com/x/web-interface/wbi/search/all/v2", { keyword });
  const result: SearchResult = { users: [], videos: [], comprehensiveVideos: [] };
  const groups: any[] = raw?.data?.result ?? [];
  for (const g of groups) {
    if (g.result_type === "bili_user") result.users = g.data;
    else if (g.result_type === "video") {
      for (const v of g.data) if (v.bvid) result.videos.push(v);
    }
  }
  result.comprehensiveVideos = result.videos.slice(0, 5);
  result.videos = result.videos.slice(0, vidCount);
  return result;
}

export async function searchByType(keyword: string, searchType: string) {
  logger.log("[search] type=", searchType);
  const raw = await httpGetWbiRaw<any>("https://api.bilibili.com/x/web-interface/wbi/search/type", {
    keyword,
    search_type: searchType,
  });
  return raw?.data;
}

import { router } from "@astralsight/astroforge-core";
import { logger } from "./logger";

// 解析 B 站 URL 跳转到对应站内页面。旧版 jumpcheck 是个长 if/else 链；
// 新版改为表驱动，方便后续扩展（动态详情、专栏、用户、视频均映射到本地路由）。

interface Rule {
  test: RegExp;
  to: (m: RegExpMatchArray) => { uri: string; params?: Record<string, string> } | undefined;
}

const RULES: Rule[] = [
  {
    test: /^https?:\/\/(?:www\.)?bilibili\.com\/video\/(BV[0-9A-Za-z]+)/,
    to: (m) => ({ uri: "pages/video/videodetail", params: { bvid: m[1] } }),
  },
  {
    test: /^https?:\/\/(?:www\.)?bilibili\.com\/read\/(cv\d+)/,
    to: (m) => ({ uri: "pages/article/articleshow", params: { cvid: m[1] } }),
  },
  {
    test: /^https?:\/\/space\.bilibili\.com\/(\d+)/,
    to: (m) => ({ uri: "pages/user", params: { mid: m[1] } }),
  },
  {
    test: /^https?:\/\/(?:www\.|t\.)?bilibili\.com\/opus\/(\d+)/,
    to: (m) => ({ uri: "pages/app/features/dynamic/detail", params: { id: m[1] } }),
  },
];

export function jumpCheck(url: string): boolean {
  for (const rule of RULES) {
    const m = url.match(rule.test);
    if (!m) continue;
    const target = rule.to(m);
    if (!target) continue;
    logger.log(`[jumpcheck] ${url} -> ${target.uri}`);
    router.push(target as any);
    return true;
  }
  logger.log(`[jumpcheck] 未匹配 ${url}`);
  return false;
}

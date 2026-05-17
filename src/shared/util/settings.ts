import { storageGetJSON, storageSetJSON } from "./storage";

// 应用设置。延续旧版字段语义，但去掉与 player 相关字段。
// loadSettings() 在 app.onCreate 调用一次；其他模块通过 getSettings() 读快照，
// 通过 updateSettings(patch) 提交修改（自动落盘）。
//
// 不再用 global.settings；任何监听需求都走显式订阅。

export interface Settings {
  /** 视频推荐相关度 1-3，越大越多大数据相关推送 */
  freshType: number;
  /** 首页一次刷新视频条数 */
  homeVidCount: number;
  /** 文章 articleshow 分页 DOM 数；默认极大值即不分页 */
  articleSplitDomCount: number;
  /** 是否启用全屏过渡 GIF（旧版叫 enableFullAnimation） */
  enableFullAnimation: boolean;
  /** 应用启动后默认进入的页面 */
  startupPage: "主页" | "动态" | "我的" | "搜索" | "消息";
  /** 已同意全部协议（EULA + 隐私）*/
  agreedAllAgreements: boolean;
  /** 是否上报匿名使用统计 */
  enableUserTracker: boolean;
  /** 私信置顶用户 mid 列表 */
  pinnedDMUsers: string[];
}

const DEFAULT_SETTINGS: Settings = {
  freshType: 3,
  homeVidCount: 10,
  articleSplitDomCount: 9999,
  enableFullAnimation: false,
  startupPage: "主页",
  agreedAllAgreements: false,
  enableUserTracker: true,
  pinnedDMUsers: [],
};

const STORAGE_KEY = "settings";

let cached: Settings = { ...DEFAULT_SETTINGS };
const listeners = new Set<(s: Settings) => void>();

export async function loadSettings(): Promise<Settings> {
  const stored = await storageGetJSON<Partial<Settings>>(STORAGE_KEY, {});
  cached = { ...DEFAULT_SETTINGS, ...stored };
  return cached;
}

export function getSettings(): Settings {
  return cached;
}

export async function updateSettings(patch: Partial<Settings>): Promise<Settings> {
  cached = { ...cached, ...patch };
  // 落盘失败不阻塞业务；下次启动会回退到磁盘上的旧值，符合最小惊讶原则。
  storageSetJSON(STORAGE_KEY, cached).catch(() => undefined);
  for (const fn of listeners) fn(cached);
  return cached;
}

export function subscribeSettings(fn: (s: Settings) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

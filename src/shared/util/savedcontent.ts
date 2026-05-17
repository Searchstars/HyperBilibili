import { fileExists, fileMkdir, fileReadText, fileWriteText, fileList } from "./file";
import { logger } from "./logger";

// 离线收藏（文章 / 视频元数据 / 评论草稿）管理器。
// 旧版 SavedContentManager 把所有内容塞进单 JSON；为减少首屏阻塞 IO，新版
// 拆为按 cvid / bvid 一文件一份；列表索引另存 `index.json`。
//
// 注意：JSON.parse 不会校验，遇到磁盘损坏会抛 SyntaxError；上层用 try/catch
// 防御即可，不在这里加自愈逻辑（节省代码 / 复杂度，损坏概率极低）。

const ROOT = "internal://files/savedcontent/";
const INDEX_URI = `${ROOT}index.json`;

export interface SavedItem {
  id: string;
  kind: "article" | "video";
  title: string;
  cover?: string;
  savedAt: number;
}

let index: SavedItem[] = [];
let inited = false;

export async function initSavedContent(): Promise<void> {
  if (inited) return;
  inited = true;

  if (!(await fileExists(ROOT))) {
    try {
      await fileMkdir(ROOT);
    } catch (err) {
      logger.warn("[savedcontent] mkdir 失败", err);
      return;
    }
  }

  if (await fileExists(INDEX_URI)) {
    try {
      index = JSON.parse(await fileReadText(INDEX_URI));
    } catch (err) {
      logger.warn("[savedcontent] index.json 损坏，重建", err);
      index = [];
    }
  }
}

export function listSaved(kind?: SavedItem["kind"]): SavedItem[] {
  return kind ? index.filter((item) => item.kind === kind) : index;
}

export async function saveContent(item: SavedItem, body: string): Promise<void> {
  const uri = entryUri(item.id);
  await fileWriteText(uri, body);
  index = index.filter((existing) => existing.id !== item.id);
  index.unshift(item);
  await fileWriteText(INDEX_URI, JSON.stringify(index));
}

export async function readContent(id: string): Promise<string | undefined> {
  const uri = entryUri(id);
  if (!(await fileExists(uri))) return undefined;
  return fileReadText(uri);
}

export async function removeSaved(id: string): Promise<void> {
  const uri = entryUri(id);
  if (await fileExists(uri)) {
    // 直接覆盖为空字符串；Vela 的 file.delete 在部分固件上偶发返回成功但实
    // 际未删除，这里求稳。
    await fileWriteText(uri, "");
  }
  index = index.filter((item) => item.id !== id);
  await fileWriteText(INDEX_URI, JSON.stringify(index));
}

// 计算 logs/ 之外的内部缓存总占用，用于清理缓存页面回显。
export async function computeSavedTotalKB(): Promise<number> {
  if (!(await fileExists(ROOT))) return 0;
  try {
    const entries = await fileList(ROOT);
    let bytes = 0;
    for (const entry of entries) bytes += entry.length ?? 0;
    return Math.round(bytes / 1024);
  } catch {
    return 0;
  }
}

function entryUri(id: string): string {
  // 仅允许字母数字下划线，防止越界路径（B 站 id 天然安全，但拒绝兜底）。
  const safe = id.replace(/[^a-zA-Z0-9_]/g, "_");
  return `${ROOT}${safe}.json`;
}

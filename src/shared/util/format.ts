// 数字 / 时间 / 持续时间 / 时间差等纯函数。
//
// 没有运行时依赖；为避免引入 dayjs 增加 rpk 体积，相对时间的本地化用极简实现。

export function formatNumber(num: number): string {
  if (!Number.isFinite(num)) return "0";
  if (num < 1000) return num.toString();
  if (num < 10000) return `${(num / 1000).toFixed(1)}k`;
  return `${(num / 10000).toFixed(1)}w`;
}

export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "00:00";
  const s = Math.floor(seconds % 60);
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor(seconds / 3600);
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export function relativeTime(timestamp: number, now: number = Date.now()): string {
  const ts = timestamp < 1e12 ? timestamp * 1000 : timestamp;
  const diff = Math.floor((now - ts) / 1000);
  if (diff < 60) return "刚刚";
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
  if (diff < 86400 * 30) return `${Math.floor(diff / 86400)}天前`;
  if (diff < 86400 * 365) return `${Math.floor(diff / 86400 / 30)}个月前`;
  return `${Math.floor(diff / 86400 / 365)}年前`;
}

export function formatDate(timestamp: number): string {
  const ts = timestamp < 1e12 ? timestamp * 1000 : timestamp;
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function getCurrentTime(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// 旧版 BVID 既出现 BV1xx 形式也出现 av 形式；统一转 BV 串。
export function normalizeBVID(v: string): string {
  if (!v) return "";
  return v.startsWith("av") || /^[0-9]+$/.test(v) ? v : v;
}

// 解码 \uXXXX 转义（B 站消息推送里偶尔出现）。
export function unicodeToString(input: string): string {
  return input.replace(/\\u([\dA-F]{4})/gi, (_, grp: string) =>
    String.fromCharCode(Number.parseInt(grp, 16)),
  );
}

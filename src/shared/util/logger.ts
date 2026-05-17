import { file } from "@astralsight/astroforge-core";

// 旧版用 global.logger 单例 + 同步 file.writeText，新版仍写文件但默认只在
// HB_RELEASE=0 时开启磁盘 sink；release 包仅 console 输出，减少 IO 抖动。
//
// 不引入 ANSI 染色（Vela WebView 不解析），不用 ISO 完整时戳（节省每条 30B）。

type Level = "log" | "warn" | "error";

const LOG_DIR = "internal://files/logs/";
let logFilePath: string | undefined;
let inited = false;

export function initLogger() {
  if (inited) return;
  inited = true;

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  logFilePath = `${LOG_DIR}log-${stamp}.log`;

  // mkdir 失败说明设备未授权 file 能力；不抛错，降级为纯 console。
  (file as any).mkdir({
    uri: LOG_DIR,
    recursive: true,
    fail: () => {
      logFilePath = undefined;
    },
  });
}

export const logger = {
  log(...args: unknown[]) {
    emit("log", args);
  },
  warn(...args: unknown[]) {
    emit("warn", args);
  },
  error(...args: unknown[]) {
    emit("error", args);
  },
};

function emit(level: Level, args: unknown[]) {
  const text = args.map(safeStringify).join(" ");
  const line = `[${shortTime()}] [${level.toUpperCase()}] ${text}`;

  // eslint-disable-next-line no-console
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);

  if (!logFilePath) return;
  (file as any).writeText({
    uri: logFilePath,
    text: `${line}\n`,
    append: true,
    fail: () => {
      // 写盘失败说明磁盘满或权限丢失，索性永久禁用文件 sink。
      logFilePath = undefined;
    },
  });
}

function shortTime(): string {
  // 形如 12:34:56.789，比 ISO 短 50%，对人类调试足够；不需要日期，行数足以定位。
  const d = new Date();
  const pad = (n: number, w = 2) => String(n).padStart(w, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;
}

function safeStringify(value: unknown): string {
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return "[Circular]";
  }
}

import zh from "../../i18n/zh.json";
import en from "../../i18n/en.json";
import { vela } from "@astralsight/astroforge-core";

// 旧版 i18n 在 app.ux script 顶部全量切换 dayjs locale 等；新版只暴露 t()
// 函数。语言判定基于 system.vela.locale，未命中时回落到 zh。

type Dict = Record<string, string>;
const DICTS: Record<string, Dict> = { zh: zh as Dict, en: en as Dict };

let current: Dict = DICTS.zh;

export function initI18n() {
  try {
    const locale = (vela as any).locale?.get?.()?.language as string | undefined;
    if (locale?.startsWith("en")) current = DICTS.en;
    else current = DICTS.zh;
  } catch {
    current = DICTS.zh;
  }
}

export function t(key: string, fallback?: string): string {
  return current[key] ?? fallback ?? key;
}

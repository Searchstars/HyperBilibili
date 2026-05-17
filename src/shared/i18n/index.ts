import zh from "./zh.json";
import en from "./en.json";
import { velaLocale } from "@astralsight/astroforge-core";

type Locale = "zh" | "en";
type Dict = Record<string, unknown>;

const dicts: Record<Locale, Dict> = { zh: zh as Dict, en: en as Dict };

let currentLocale: Locale = "zh";

function detect(): Locale {
  try {
    const info = velaLocale.get();
    const lang = (info?.language || "").toLowerCase();
    if (lang.startsWith("en")) return "en";
  } catch {
    // fallthrough
  }
  return "zh";
}

export function initI18n(): void {
  currentLocale = detect();
}

export function getLocale(): Locale {
  return currentLocale;
}

export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

function lookup(dict: Dict, path: string[]): unknown {
  let cur: unknown = dict;
  for (const seg of path) {
    if (cur && typeof cur === "object" && seg in (cur as Dict)) {
      cur = (cur as Dict)[seg];
    } else {
      return undefined;
    }
  }
  return cur;
}

export function t(key: string, locale?: Locale): string {
  const path = key.split(".");
  const dict = dicts[locale ?? currentLocale];
  const value = lookup(dict, path);
  if (typeof value === "string") return value;
  const fallback = lookup(dicts.zh, path);
  return typeof fallback === "string" ? fallback : key;
}

export function useT(): (key: string) => string {
  // Pages don't need to subscribe; locale is set once at app boot and stable.
  return t;
}

import { httpGet } from "./http";
import { buildinfo } from "../util/buildinfo";

// 极简版本号比较，仅支持 a.b.c 形式；不引入 semver。
function lt(a: string, b: string): boolean {
  const ap = a.split(".").map((n) => Number.parseInt(n, 10) || 0);
  const bp = b.split(".").map((n) => Number.parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(ap.length, bp.length); i++) {
    const av = ap[i] ?? 0;
    const bv = bp[i] ?? 0;
    if (av < bv) return true;
    if (av > bv) return false;
  }
  return false;
}

export async function checkUpdate(): Promise<{ hasUpdate: boolean; msg: string }> {
  try {
    const latest = await httpGet<string>(
      "https://gitee.com/search__stars/hb_ota_info/raw/master/current_ver",
      "text",
    );
    const ver = String(latest ?? "").trim();
    if (ver && lt(buildinfo.versionName, ver)) {
      return {
        hasUpdate: true,
        msg: `检查到更新 v${ver}，请前往 hyperbili.astralsight.space 下载`,
      };
    }
    return { hasUpdate: false, msg: "" };
  } catch {
    return { hasUpdate: false, msg: "" };
  }
}

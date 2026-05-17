// 生成 src/.buildinfo.json，被 astroforge.config.ts 与 src/shared/util/buildinfo.ts 引用。
//
// 旧版用 webpack DefinePlugin 注入 `$buildinfo`，新版改为生成真实 JSON 文件。
// 这样 IR 文档稳定可复现，无副作用；并避免运行时通过 `global` 访问全局变量。

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const outPath = resolve(root, "src/.buildinfo.json");

const pkgRaw = readFileSync(resolve(root, "package.json"), "utf8");
const pkg = JSON.parse(pkgRaw);

const versionName = pkg.version ?? "0.0.0";
const versionCode = computeVersionCode(versionName);

const gitCommit = safeExec(["git", "rev-parse", "--short=8", "HEAD"]) ?? "unknown";
const gitBranch = safeExec(["git", "rev-parse", "--abbrev-ref", "HEAD"]) ?? "unknown";
const buildAt = new Date().toISOString();

const info = {
  versionName,
  versionCode,
  gitCommit,
  gitBranch,
  buildAt,
  isRelease: process.env.HB_RELEASE === "1",
};

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, `${JSON.stringify(info, null, 2)}\n`);
console.log(`[gen-buildinfo] versionName=${versionName} versionCode=${versionCode} commit=${gitCommit}`);

// 把语义化版本 a.b.c 映射成单调递增的 4 位整数 versionCode。
// 旧版 manifest.versionCode 是手写的 2，新版改为派生，确保升级链不出错。
function computeVersionCode(version) {
  const [major = 0, minor = 0, patch = 0] = version
    .split(".")
    .map((part) => Number.parseInt(part, 10) || 0);
  return major * 10000 + minor * 100 + patch;
}

function safeExec(args) {
  try {
    return execFileSync(args[0], args.slice(1), { cwd: root, encoding: "utf8" }).trim();
  } catch {
    return undefined;
  }
}

// scripts/swap-manifest.mjs
//
// AstroForge rsbuild plugin 当前要求 astroforge.config.ts 里所有字段都是
// 字面量；不能用变量 / 三元 / process.env。所以 dev <-> release 包名 + icon
// 通过本脚本在构建前对 astroforge.config.ts 里 `package: ...` 和 `icon: ...`
// 两行做字符串替换（识别上方注释行 HB_MANIFEST_PACKAGE / HB_MANIFEST_ICON）。
//
// 用法：
//   HB_MODE=release node scripts/swap-manifest.mjs
//   HB_MODE=dev     node scripts/swap-manifest.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const mode = process.env.HB_MODE === "release" ? "release" : "dev";
const config = resolve(import.meta.dirname, "..", "astroforge.config.ts");

const targets = {
  dev: {
    PACKAGE: "com.searchstars.hyperbilibili.dev",
    ICON: "/common/logoDEV.png",
  },
  release: {
    PACKAGE: "com.searchstars.hyperbilibili",
    ICON: "/common/logo96.png",
  },
};

const target = targets[mode];
const src = readFileSync(config, "utf8");

let out = src;
out = out.replace(
  /(\/\/ HB_MANIFEST_PACKAGE[^\n]*\n\s*package:\s*)"[^"]*"/,
  `$1"${target.PACKAGE}"`,
);
out = out.replace(
  /(\/\/ HB_MANIFEST_ICON[^\n]*\n\s*icon:\s*)"[^"]*"/,
  `$1"${target.ICON}"`,
);

if (out !== src) {
  writeFileSync(config, out);
  console.log(`[swap-manifest] ${mode}: PACKAGE=${target.PACKAGE} ICON=${target.ICON}`);
} else {
  console.log(`[swap-manifest] ${mode}: no change`);
}

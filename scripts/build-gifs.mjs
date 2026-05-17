// scripts/build-gifs.mjs
//
// 将 src/common/seqanims/<name>/*.png 序列帧打包成 src/common/seqanims/<name>.gif，
// 取代旧版 animation/engine.ts 的 SequenceAnim 类。
//
// 依赖：sharp + gifenc。若依赖未安装则跳过（在 CI 之外允许）。
//
// 当前 entry → arealist 路径只用到 loginWhite 序列帧（28 帧），下面以白名单形式声明。
// 后续需要更多序列帧时直接往 SEQUENCES 里追加即可。

import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

const root = resolve(import.meta.dirname, "..");
const seqDir = resolve(root, "src/common/seqanims");

const SEQUENCES = [
  // { name: "loginWhite", pattern: "icons8-login-*.png", durationMs: 1000, loop: 0 },
];

if (!existsSync(seqDir)) {
  console.log("[build-gifs] no seqanims dir, skipping");
  process.exit(0);
}

let sharp;
let gifenc;
try {
  sharp = (await import("sharp")).default;
  gifenc = await import("gifenc");
} catch {
  console.log("[build-gifs] sharp/gifenc not installed, skipping (run `pnpm add -D sharp gifenc` to enable)");
  process.exit(0);
}

for (const entry of readdirSync(seqDir)) {
  const dir = join(seqDir, entry);
  if (!statSync(dir).isDirectory()) continue;

  const config = SEQUENCES.find((s) => s.name === entry);
  if (!config) {
    console.log(`[build-gifs] no config for ${entry}, skipping`);
    continue;
  }

  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".png"))
    .sort();
  if (files.length === 0) continue;

  console.log(`[build-gifs] ${entry}: ${files.length} frames`);

  const frames = [];
  let width = 0;
  let height = 0;
  for (const f of files) {
    const { data, info } = await sharp(join(dir, f))
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    width = info.width;
    height = info.height;
    frames.push(data);
  }

  const { GIFEncoder, quantize, applyPalette } = gifenc;
  const gif = GIFEncoder();
  const delay = Math.max(20, Math.floor(config.durationMs / files.length));

  for (const frame of frames) {
    const palette = quantize(frame, 256, { format: "rgba4444" });
    const indexed = applyPalette(frame, palette, "rgba4444");
    gif.writeFrame(indexed, width, height, {
      palette,
      delay,
      transparent: true,
    });
  }
  gif.finish();

  const outPath = join(seqDir, `${entry}.gif`);
  mkdirSync(seqDir, { recursive: true });
  const { writeFileSync } = await import("node:fs");
  writeFileSync(outPath, gif.bytes());
  console.log(`[build-gifs] wrote ${outPath}`);
}

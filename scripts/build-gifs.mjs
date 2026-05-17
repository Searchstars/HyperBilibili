// 把旧版 common/seqanims/ 下的序列帧 PNG 合成成单个 GIF。
//
// 旧版用自研 animation 引擎 + setInterval 切换帧；新设备已支持 GIF，新版用
// `<image src="*.gif" />` 直接交给渲染层。该脚本：
//   1. 扫描 src/common/seqanims/<name>/*.png（按文件名排序）
//   2. 用 sharp 解码并归一到目标尺寸（默认 360x360，可命令行覆盖）
//   3. 用 gifenc 量化 + 帧间合并，写入 src/common/seqanims/<name>.gif
//   4. 删除原序列帧目录以减少 rpk 体积（可用 --keep 关闭）
//
// 使用：node scripts/build-gifs.mjs            （处理全部）
//      node scripts/build-gifs.mjs <name>      （处理单个）
//      node scripts/build-gifs.mjs --keep      （保留原帧）

import { readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const seqRoot = resolve(root, "src/common/seqanims");

const args = process.argv.slice(2);
const keep = args.includes("--keep");
const filter = args.filter((arg) => !arg.startsWith("--"))[0];

const DEFAULT_FPS = 24;
const DEFAULT_SIZE = 360;

main().catch((err) => {
  console.error("[build-gifs] 失败:", err);
  process.exit(1);
});

async function main() {
  const sharp = await tryImport("sharp");
  const { GIFEncoder, quantize, applyPalette } = await tryImport("gifenc");
  if (!sharp || !GIFEncoder) {
    console.error("[build-gifs] 缺少 sharp 或 gifenc，请先 pnpm i");
    process.exit(1);
  }

  const dirs = readdirSync(seqRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !filter || name === filter);

  if (dirs.length === 0) {
    console.warn(`[build-gifs] ${seqRoot} 下未找到序列帧目录`);
    return;
  }

  for (const name of dirs) {
    await convertOne({ name, sharp, GIFEncoder, quantize, applyPalette });
  }
}

async function convertOne({ name, sharp, GIFEncoder, quantize, applyPalette }) {
  const dir = resolve(seqRoot, name);
  const frames = readdirSync(dir)
    .filter((file) => /\.(png|jpg|jpeg|webp)$/i.test(file))
    .sort();
  if (frames.length === 0) {
    console.warn(`[build-gifs] ${name}: 没有帧文件`);
    return;
  }

  const enc = GIFEncoder();
  const delay = Math.round(1000 / DEFAULT_FPS);
  for (const file of frames) {
    const { data, info } = await sharp(resolve(dir, file))
      .resize(DEFAULT_SIZE, DEFAULT_SIZE, { fit: "cover" })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const palette = quantize(data, 256, { format: "rgba4444" });
    const index = applyPalette(data, palette, "rgba4444");
    enc.writeFrame(index, info.width, info.height, {
      palette,
      delay,
      transparent: true,
      transparentIndex: 0,
    });
  }
  enc.finish();
  const out = resolve(seqRoot, `${name}.gif`);
  writeFileSync(out, enc.bytes());
  const size = statSync(out).size;
  console.log(`[build-gifs] ${name} -> ${basename(out)} (${frames.length} 帧, ${(size / 1024).toFixed(1)} KB)`);

  if (!keep) {
    rmSync(dir, { recursive: true });
  }
}

async function tryImport(name) {
  try {
    return await import(name);
  } catch {
    return undefined;
  }
}

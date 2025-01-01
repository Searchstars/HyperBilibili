import * as fs from 'fs';
import * as jpeg from 'jpeg-js';

/** 
 * 用于表示像素的 RGB 颜色 
 * [r, g, b] 每个范围 0~255
 */
type Color = [number, number, number];

/*************************************************************************
 * 1. 使用 jpeg-js 解码 JPG，并抽取像素用于 K-means
 *************************************************************************/

/**
 * 从指定文件读取并解码 JPG 得到原始 RGBA 像素数据。
 * @param filePath 
 * @returns { data: Uint8Array; width: number; height: number }
 */
function decodeJpg(filePath: string) {
  const jpgBuffer = fs.readFileSync(filePath);
  // jpeg.decode 返回 { data: Buffer, width, height }
  // data 是 RGBA (width * height * 4)
  const decoded = jpeg.decode(jpgBuffer, { useTArray: true });
  return {
    data: decoded.data,   // Uint8Array，顺序 RGBA
    width: decoded.width,
    height: decoded.height,
  };
}

/**
 * 计算两种颜色(RGB)的欧几里得距离
 */
function distance(c1: Color, c2: Color): number {
  const dr = c1[0] - c2[0];
  const dg = c1[1] - c2[1];
  const db = c1[2] - c2[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/*************************************************************************
 * 2. K-means 聚类核心
 *************************************************************************/

/**
 * 对给定像素集合执行 K-means 聚类，返回聚类中心（颜色）。
 * @param pixels  所有像素的 RGB 数组
 * @param k       聚类数量
 * @param maxIterations 迭代次数上限
 * @param tolerance     判断收敛的距离阈值
 * @returns {Color[]} k 个聚类中心（RGB）
 */
function kMeansCluster(
  pixels: Color[], 
  k: number, 
  maxIterations = 50, 
  tolerance = 1.0
): Color[] {
  // 1. 随机初始化 k 个聚类中心 (从像素中随机选 k 个)
  const centers: Color[] = [];
  for (let i = 0; i < k; i++) {
    const randomIndex = Math.floor(Math.random() * pixels.length);
    centers.push([...pixels[randomIndex]] as Color);
  }

  // 用于存储每次迭代时每个像素的所属聚类
  let assignments: number[] = new Array(pixels.length).fill(-1);

  for (let iter = 0; iter < maxIterations; iter++) {
    // 记录旧中心，用于判断收敛
    const oldCenters = centers.map((c) => [...c]) as Color[];

    // 2.1 为每个像素找到离自己最近的中心
    for (let pIndex = 0; pIndex < pixels.length; pIndex++) {
      let minDist = Infinity;
      let clusterIndex = 0;
      for (let cIndex = 0; cIndex < k; cIndex++) {
        const dist = distance(pixels[pIndex], centers[cIndex]);
        if (dist < minDist) {
          minDist = dist;
          clusterIndex = cIndex;
        }
      }
      assignments[pIndex] = clusterIndex;
    }

    // 2.2 重新计算每个聚类的中心(将同一个 cluster 里的所有像素平均值作为新的中心)
    const sums: Color[] = new Array(k).fill([0, 0, 0]).map(() => [0, 0, 0]);
    const counts: number[] = new Array(k).fill(0);

    for (let pIndex = 0; pIndex < pixels.length; pIndex++) {
      const clusterIndex = assignments[pIndex];
      sums[clusterIndex][0] += pixels[pIndex][0];
      sums[clusterIndex][1] += pixels[pIndex][1];
      sums[clusterIndex][2] += pixels[pIndex][2];
      counts[clusterIndex]++;
    }

    for (let cIndex = 0; cIndex < k; cIndex++) {
      if (counts[cIndex] > 0) {
        centers[cIndex][0] = sums[cIndex][0] / counts[cIndex];
        centers[cIndex][1] = sums[cIndex][1] / counts[cIndex];
        centers[cIndex][2] = sums[cIndex][2] / counts[cIndex];
      }
    }

    // 2.3 判断是否收敛：新旧中心之间的最大移动距离 < tolerance
    let maxShift = 0;
    for (let cIndex = 0; cIndex < k; cIndex++) {
      const shift = distance(centers[cIndex], oldCenters[cIndex]);
      if (shift > maxShift) {
        maxShift = shift;
      }
    }
    if (maxShift < tolerance) {
      // 收敛
      break;
    }
  }

  // 返回最终的 k 个聚类中心(颜色分量取整)
  return centers.map(c => [
    Math.round(c[0]),
    Math.round(c[1]),
    Math.round(c[2])
  ] as Color);
}

/**
 * 提取 3 个主要颜色主流程：
 *   1. 读取并解码图片 -> RGBA
 *   2. 抽取 (R,G,B) 像素
 *   3. 用 K-means 求得 3 个主要颜色
 */
function extractTop3Colors(filePath: string): Color[] {
  console.log(`[INFO] decoding JPG: ${filePath}`);
  const { data, width, height } = decodeJpg(filePath);

  // data: RGBA，(width * height * 4)
  const sampleStep = Math.max(1, Math.floor((width * height) / 20000));

  const pixels: Color[] = [];
  for (let i = 0; i < width * height; i += sampleStep) {
    const r = data[i * 4 + 0];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    // alpha 通常忽略
    pixels.push([r, g, b]);
  }

  console.log(`[INFO] Running K-means for 3 clusters (sample size = ${pixels.length})...`);
  const k = 3;
  const centers = kMeansCluster(pixels, k);

  return centers;
}

/*************************************************************************
 * 3. 在新图上绘制 3 个「从圆心色 -> 背景透明」的圆，并保存为 JPG
 *************************************************************************/

/** 画布大小 */
const CANVAS_WIDTH = 430;
const CANVAS_HEIGHT = 250;

/** 背景颜色 */
const BACKGROUND_COLOR: [number, number, number, number] = [0, 0, 0, 255];

/**
 * 圆心/半径的范围，可自行修改：
 *   - 圆心距离画布边缘至少 MARGIN 
 *   - 半径范围 [MIN_RADIUS, MAX_RADIUS]
 */
const MARGIN = 2;
const MIN_RADIUS = 80;
const MAX_RADIUS = 110;

/**
 * 圆与圆之间的最小距离（基于圆心与圆心之间的距离减去半径之和）。
 * 如果希望**完全不重叠**，可令:
 *   distanceBetweenCenters >= (r1 + r2 + MIN_GAP_BETWEEN_CIRCLES).
 */
const MIN_GAP_BETWEEN_CIRCLES = 20;

/**
 * 新增：圆心颜色亮度因子 (0~1)，用于降低圆心过亮
 * 例如：0.8 -> 稍微暗一点；0.5 -> 明显暗
 */
const COLOR_BRIGHTNESS_FACTOR = 0.62;

/**
 * 对 RGBA 像素进行 alpha 混合：
 *   outA = srcA + dstA * (1 - srcA)
 *   outRGB = (srcRGB * srcA + dstRGB * dstA * (1 - srcA)) / outA
 *
 * data 数组中每像素 4 通道：R, G, B, A，值范围 [0,255]
 * alpha 范围 [0,1]
 */
function alphaBlendPixel(
  data: Uint8Array, 
  x: number, 
  y: number, 
  width: number, 
  color: Color, 
  alpha: number
) {
  const offset = (y * width + x) * 4;
  const dstR = data[offset + 0];
  const dstG = data[offset + 1];
  const dstB = data[offset + 2];
  const dstA = data[offset + 3] / 255; // 转为 0~1

  const srcR = color[0];
  const srcG = color[1];
  const srcB = color[2];
  const srcA = alpha;

  const outA = srcA + dstA * (1 - srcA);
  if (outA > 0) {
    const outR = (srcR * srcA + dstR * dstA * (1 - srcA)) / outA;
    const outG = (srcG * srcA + dstG * dstA * (1 - srcA)) / outA;
    const outB = (srcB * srcA + dstB * dstA * (1 - srcA)) / outA;

    data[offset + 0] = Math.round(outR);
    data[offset + 1] = Math.round(outG);
    data[offset + 2] = Math.round(outB);
    data[offset + 3] = Math.round(outA * 255);
  } else {
    // outA=0 -> 全透明
    data[offset + 0] = 0;
    data[offset + 1] = 0;
    data[offset + 2] = 0;
    data[offset + 3] = 0;
  }
}

/**
 * 在 data 上绘制一个「从 centerColor->背景透明」的径向渐变圆
 * @param data  画布（RGBA）
 * @param width, height  画布尺寸
 * @param cx, cy 圆心坐标
 * @param radius 半径
 * @param centerColor 圆心处的颜色 (RGB)
 */
function drawRadialGradientCircle(
  data: Uint8Array, 
  width: number,
  height: number,
  cx: number, 
  cy: number,
  radius: number,
  centerColor: Color
) {
  // 仅在圆的外接矩形范围内绘制
  const minX = Math.max(0, cx - radius);
  const maxX = Math.min(width - 1, cx + radius);
  const minY = Math.max(0, cy - radius);
  const maxY = Math.min(height - 1, cy + radius);

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= radius) {
        // 根据距离，计算该点的 alpha：
        //   圆心 dist=0 -> alpha=1
        //   半径 dist=radius -> alpha=0
        const alpha = 1 - dist / radius;
        alphaBlendPixel(data, x, y, width, centerColor, alpha);
      }
    }
  }
}

/** 
 * 工具函数：判断新圆 (cx, cy, r) 与已放置的圆数组 placedCircles
 * 是否满足“互不重叠”，即： 
 *   distanceBetweenCenters >= (r + oldCircle.r + MIN_GAP_BETWEEN_CIRCLES)
 */
function canPlaceCircle(
  cx: number, 
  cy: number, 
  r: number, 
  placedCircles: { cx: number, cy: number, r: number }[],
  minGap: number
): boolean {
  for (const c of placedCircles) {
    const dist = Math.sqrt((cx - c.cx) ** 2 + (cy - c.cy) ** 2);
    // 如果距离 < 两个半径和 + minGap，就判定为重叠
    if (dist < (r + c.r + minGap)) {
      return false;
    }
  }
  return true;
}

/**
 * 生成画布并绘制 3 个不会彼此重叠的渐变圆
 * @param colors 3 个原始颜色 (RGB)
 */
function generateCirclesImage(colors: Color[]): { data: Uint8Array; width: number; height: number } {
  const width = CANVAS_WIDTH;
  const height = CANVAS_HEIGHT;

  // 1. 创建画布并填充背景
  const data = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    data[i * 4 + 0] = BACKGROUND_COLOR[0];
    data[i * 4 + 1] = BACKGROUND_COLOR[1];
    data[i * 4 + 2] = BACKGROUND_COLOR[2];
    data[i * 4 + 3] = BACKGROUND_COLOR[3];
  }

  // 2. 依次为 3 个颜色生成圆，确保不重叠
  const placedCircles: { cx: number; cy: number; r: number }[] = [];
  for (let i = 0; i < 3; i++) {
    let circlePlaced = false;

    // 最多尝试多次，若都无法放置，就跳过
    const MAX_TRIES = 100;

    const radius = randInt(MIN_RADIUS, MAX_RADIUS);
    var cx = 0;
    var cy = 0;
    for (let attempt = 0; attempt < MAX_TRIES; attempt++) {
      cx = randInt(radius + MARGIN, width - radius - MARGIN);
      cy = randInt(radius + MARGIN, height - radius - MARGIN);

      if (canPlaceCircle(cx, cy, radius, placedCircles, MIN_GAP_BETWEEN_CIRCLES)) {
        // 找到不重叠的位置了
        placedCircles.push({ cx, cy, r: radius });
        circlePlaced = true;
        break;
      }
    }

    if (!circlePlaced) {
      console.warn(
        `[WARN] 无法在 ${MAX_TRIES} 次随机尝试中给第${i + 1}个圆找到合适位置，但仍然绘制。`
      );
      placedCircles.push({ cx, cy, r: radius });
    }
  }

  // 3. 把成功放置的圆绘制到画布
  //    在这里应用 COLOR_BRIGHTNESS_FACTOR，降低每个圆心的RGB
  placedCircles.forEach((c, idx) => {
    // 取对应颜色(若 idx>=colors.length，可加保护)
    const origColor = colors[idx] || [255, 255, 255];
    // 调整亮度
    const adjustedColor: Color = [
      Math.min(255, Math.max(0, origColor[0] * COLOR_BRIGHTNESS_FACTOR)),
      Math.min(255, Math.max(0, origColor[1] * COLOR_BRIGHTNESS_FACTOR)),
      Math.min(255, Math.max(0, origColor[2] * COLOR_BRIGHTNESS_FACTOR)),
    ];

    console.log(
      `[INFO] Circle #${idx + 1}: center=(${c.cx},${c.cy}), radius=${c.r}, color=${adjustedColor}`
    );
    drawRadialGradientCircle(data, width, height, c.cx, c.cy, c.r, adjustedColor);
  });

  return { data, width, height };
}

/**
 * 将 RGBA 数据保存为 JPG 文件
 */
function saveAsJpeg(data: Uint8Array, width: number, height: number, outPath: string) {
  const rawImageData = {
    data: Buffer.from(data), // jpeg-js 需要 Buffer 类型
    width,
    height,
  };
  // 设定 jpg 质量
  const jpegImageData = jpeg.encode(rawImageData, 80);
  fs.writeFileSync(outPath, jpegImageData.data);
  console.log(`[INFO] Saved: ${outPath}`);
}

/**
 * 工具函数：在 [min, max] 范围内随机整数
 */
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*************************************************************************
 * 4. 主函数：读取命令行参数并执行
 *************************************************************************/

function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log(`用法: node kmeans-colors.js <jpg文件路径>`);
    process.exit(1);
  }
  const filePath = args[0];
  if (!fs.existsSync(filePath)) {
    console.error(`[ERROR] 文件不存在: ${filePath}`);
    process.exit(2);
  }

  // 1) 提取 3 个主色
  const top3Colors = extractTop3Colors(filePath);
  console.log(`\n[RESULT] 主要颜色 (RGB):`);
  top3Colors.forEach((c, idx) => {
    console.log(`  #${idx + 1}: R=${c[0]}, G=${c[1]}, B=${c[2]}`);
  });

  // 2) 用这 3 个颜色在 400×400 的画布上绘制不重叠的渐变圆
  const { data, width, height } = generateCirclesImage(top3Colors);

  // 3) 保存结果为 JPG
  const outPath = 'output-circles.jpg';
  saveAsJpeg(data, width, height, outPath);
}

if (require.main === module) {
  main();
}
import { Image, View } from "@astralsight/astroforge-core";

export interface LoadingProps {
  /** 像素尺寸，默认 60 */
  size?: number;
  className?: string;
  style?: Record<string, string>;
}

/**
 * Loading：原版用 28 帧 SequenceAnim 翻图，新版换成 GIF。
 *
 * 若 build-gifs.mjs 还没把序列帧打包成 GIF，则回落到旧版第 1 帧静态图——
 * 至少 UI 不会留空白。
 */
export function Loading({ size = 60, className, style }: LoadingProps) {
  const src = "/common/loading-blue.gif";

  return (
    <View
      className={`flex items-center justify-center ${className ?? ""}`}
      style={style}
    >
      <Image
        src={src}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          objectFit: "contain",
        }}
      />
    </View>
  );
}

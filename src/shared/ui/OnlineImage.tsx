import { Image, View, useState } from "@astralsight/astroforge-core";

interface Props {
  src?: string;
  /** 加载占位 / 失败兜底；默认透明灰底 */
  placeholder?: string;
  className?: string;
  /**
   * 宿主图像就绪后回调。来自 AstroForge 0.0.9+ 新增的 Image.onComplete 事件，
   * 由 Vela 内置 `complete` 事件驱动。常用于在拿到真实位图后启动入场动画 /
   * 取色 / 模糊背景。
   */
  onComplete?: (evt: any) => void;
  /** 兜底点击 */
  onClick?: (evt: any) => void;
}

// 网络图片包装：在 src 为空或还未拿到时显示 placeholder，src 成功 complete 后
// 切到真图。仅一层 useState (loaded) 用于过渡，足够覆盖列表场景。
export default function OnlineImage({ src, placeholder, className, onComplete, onClick }: Props) {
  const [loaded, setLoaded] = useState(false);

  const realSrc = src && loaded ? src : placeholder ?? "/common/alphaimg.png";
  return (
    <View className={className ?? ""} onClick={onClick}>
      <Image
        src={realSrc}
        className="h-full w-full"
        onComplete={(evt) => {
          setLoaded(true);
          if (onComplete) onComplete(evt);
        }}
      />
    </View>
  );
}

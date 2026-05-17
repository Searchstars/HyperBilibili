import { Scroll } from "@astralsight/astroforge-core";
import type { PropsWithChildren } from "@astralsight/astroforge-core";

export interface ScrollListProps extends PropsWithChildren {
  /** 触底回调；用于分页加载 */
  onScrollBottom?: () => void;
  /** scroll-y / scroll-x，默认 y */
  vertical?: boolean;
  bounces?: boolean;
  className?: string;
  style?: Record<string, string>;
}

export function ScrollList({
  onScrollBottom,
  vertical = true,
  bounces = true,
  className,
  style,
  children,
}: ScrollListProps) {
  const handleScroll = onScrollBottom
    ? (evt: any) => {
        // AstroForge Scroll 暴露 onScroll 事件；触底由 (scrollTop + clientHeight) ≥ scrollHeight 判定
        const detail = evt?.detail ?? evt;
        if (!detail) return;
        const top = detail.scrollTop ?? detail.scrollY ?? 0;
        const total = detail.scrollHeight ?? 0;
        const visible = detail.clientHeight ?? detail.height ?? 0;
        if (total > 0 && top + visible >= total - 4) {
          onScrollBottom();
        }
      }
    : undefined;

  return (
    <Scroll
      className={`flex-col items-center w-full h-full ${className ?? ""}`}
      scrollX={!vertical}
      scrollY={vertical}
      bounces={bounces}
      style={style}
      onScroll={handleScroll as any}
    >
      {children}
    </Scroll>
  );
}

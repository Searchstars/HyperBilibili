import { View } from "@astralsight/astroforge-core";
import type { PropsWithChildren } from "@astralsight/astroforge-core";
import { TitleBar } from "./TitleBar";
import { usePageTransition } from "../hooks/usePageTransition";

export interface PageShellProps extends PropsWithChildren {
  title?: string;
  showBack?: boolean;
  onBack?: () => boolean | void;
  /** 是否要 TitleBar；某些页面（splash/entry）不需要 */
  noTitleBar?: boolean;
  /** 启用过渡动画 */
  transition?: boolean;
  className?: string;
  style?: Record<string, string>;
}

export function PageShell({
  title,
  showBack = true,
  onBack,
  noTitleBar = false,
  transition = true,
  className,
  style,
  children,
}: PageShellProps) {
  const tx = usePageTransition();
  const txClass = transition ? tx.className : "";

  return (
    <View
      className={`page flex-col items-center w-full h-full ${txClass} ${className ?? ""}`}
      style={{ backgroundColor: "#000000", ...style }}
    >
      {!noTitleBar && title && (
        <TitleBar title={title} showBack={showBack} onBack={onBack} />
      )}
      {children}
    </View>
  );
}

import { View } from "@astralsight/astroforge-core";
import "../../tailwind.css";
import "../../vela-tailwind.css";

// 页面根容器。强制 100% × 100%、黑底、列方向。
//
// 为什么单独抽出而不直接在每页用 View：rsbuild-plugin 在每个页面顶部都会扫
// 描组件 import 并合并样式表，统一通过 PageShell 引入两份 css，避免漏导致
// 第一帧无样式闪烁。

interface Props {
  children?: any;
  /** 仅覆盖最外层 className。需要更精细布局请在外层包一层。 */
  className?: string;
}

export default function PageShell({ children, className }: Props) {
  const cls = `page-root ${className ?? ""}`;
  return <View className={cls}>{children}</View>;
}

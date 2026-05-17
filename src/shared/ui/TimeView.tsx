import { Text } from "@astralsight/astroforge-core";
import { relativeTime } from "../util/format";

interface Props {
  /** 毫秒或秒；自动判断。 */
  timestamp: number;
  className?: string;
}

// 旧版 TimeView 是自定义组件，里面每秒 setInterval 刷新；实际上对秒级以下
// 的精度没意义。新版改为渲染瞬时值，不内置 ticker。需要刷新的页面自行用
// useEffect + 定时器。
export default function TimeView({ timestamp, className }: Props) {
  return <Text className={className ?? "text-xs text-gray-400"}>{relativeTime(timestamp)}</Text>;
}

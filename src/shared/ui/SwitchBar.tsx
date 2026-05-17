import { Text, View } from "@astralsight/astroforge-core";

interface Props {
  items: string[];
  /** 受控 index，从 0 开始。 */
  active: number;
  onChange?: (idx: number) => void;
}

// 简版水平 tab 切换条。仅展示与回调；不维护内部 active state，避免双源真相。
export default function SwitchBar({ items, active, onChange }: Props) {
  return (
    <View className="flex w-full flex-row items-center justify-around">
      {items.map((item, idx) => (
        <View
          key={item}
          className={`flex h-8 flex-1 items-center justify-center ${idx === active ? "border-b-2 border-pink-500" : ""}`}
          onClick={() => onChange && onChange(idx)}
        >
          <Text className={`text-sm ${idx === active ? "text-white" : "text-gray-400"}`}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

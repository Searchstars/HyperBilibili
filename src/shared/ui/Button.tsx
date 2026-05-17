import { Text, View } from "@astralsight/astroforge-core";

interface Props {
  label?: string;
  className?: string;
  textClassName?: string;
  onClick?: (evt: any) => void;
  children?: any;
}

// 通用按钮。默认胶囊形 + 粉色背景，与旧版 DefaultButton 视觉一致。
export default function Button({ label, className, textClassName, onClick, children }: Props) {
  return (
    <View
      className={`flex h-9 min-w-20 items-center justify-center rounded-full bg-pink-600 px-4 ${className ?? ""}`}
      onClick={onClick}
    >
      {label ? <Text className={`text-sm text-white ${textClassName ?? ""}`}>{label}</Text> : children}
    </View>
  );
}

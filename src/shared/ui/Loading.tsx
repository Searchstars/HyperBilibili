import { Image, Text, View } from "@astralsight/astroforge-core";

interface Props {
  text?: string;
  className?: string;
}

// 全屏 loading 占位。GIF 直接走渲染层，无需自研动画引擎。
export default function Loading({ text, className }: Props) {
  return (
    <View className={`flex h-full w-full flex-col items-center justify-center ${className ?? ""}`}>
      <Image src="/common/loading-blue.gif" className="h-16 w-16" />
      {text ? <Text className="mt-3 text-sm text-gray-300">{text}</Text> : null}
    </View>
  );
}

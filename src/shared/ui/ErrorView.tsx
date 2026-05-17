import { Image, Text, View } from "@astralsight/astroforge-core";

interface Props {
  message?: string;
  /** 重试按钮文案；不传则不显示按钮。 */
  retryLabel?: string;
  onRetry?: () => void;
}

export default function ErrorView({ message, retryLabel, onRetry }: Props) {
  return (
    <View className="flex h-full w-full flex-col items-center justify-center">
      <Image src="/common/warning_icon.png" className="h-12 w-12" />
      <Text className="mt-2 px-6 text-center text-sm text-gray-300">{message ?? "出错了"}</Text>
      {retryLabel ? (
        <View
          className="mt-4 flex h-8 w-24 items-center justify-center rounded-full bg-pink-600"
          onClick={onRetry}
        >
          <Text className="text-sm text-white">{retryLabel}</Text>
        </View>
      ) : null}
    </View>
  );
}

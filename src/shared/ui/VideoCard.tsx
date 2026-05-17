import { Image, Text, View, router } from "@astralsight/astroforge-core";
import OnlineImage from "./OnlineImage";
import { formatDuration, formatNumber } from "../util/format";

interface Props {
  bvid?: string;
  title?: string;
  cover?: string;
  duration?: number;
  upName?: string;
  views?: number;
  className?: string;
}

// 横向视频卡片。点击跳详情；统计字段缺失时显示 0。
export default function VideoCard({ bvid, title, cover, duration, upName, views, className }: Props) {
  const onClick = () => {
    if (!bvid) return;
    router.push({ uri: "pages/video/videodetail", params: { bvid } });
  };
  return (
    <View className={`flex w-full flex-row items-center px-3 py-2 ${className ?? ""}`} onClick={onClick}>
      <View className="relative h-16 w-28 overflow-hidden rounded-md">
        <OnlineImage src={cover} className="h-full w-full" />
        {duration ? (
          <View className="absolute bottom-1 right-1 rounded bg-black/60 px-1">
            <Text className="text-xs text-white">{formatDuration(duration)}</Text>
          </View>
        ) : null}
      </View>
      <View className="ml-3 flex flex-1 flex-col">
        <Text className="text-sm text-white">{title ?? ""}</Text>
        <View className="mt-1 flex flex-row items-center">
          <Text className="text-xs text-gray-400">{upName ?? ""}</Text>
          {views !== undefined ? (
            <View className="ml-2 flex flex-row items-center">
              <Image src="/common/playcounticon.png" className="h-3 w-3" />
              <Text className="ml-1 text-xs text-gray-400">{formatNumber(views)}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

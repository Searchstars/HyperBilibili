import { Text, View, router } from "@astralsight/astroforge-core";
import OnlineImage from "./OnlineImage";

interface Props {
  cvid?: string | number;
  title?: string;
  cover?: string;
  summary?: string;
  className?: string;
}

// 专栏文章卡片入口；点击进入 articleshow。
export default function Article({ cvid, title, cover, summary, className }: Props) {
  const onClick = () => {
    if (!cvid) return;
    router.push({ uri: "pages/article/articleshow", params: { cvid: `cv${cvid}` } });
  };
  return (
    <View className={`flex w-full flex-row items-start px-3 py-3 ${className ?? ""}`} onClick={onClick}>
      <OnlineImage src={cover} className="h-16 w-20 rounded" />
      <View className="ml-3 flex flex-1 flex-col">
        <Text className="text-sm text-white">{title ?? ""}</Text>
        {summary ? <Text className="mt-1 text-xs text-gray-400">{summary}</Text> : null}
      </View>
    </View>
  );
}

import { Image, Text, View, router } from "@astralsight/astroforge-core";
import PageShell from "../../shared/ui/PageShell";

// 主菜单（旧版 arealist）。九宫格风格的入口列表。
const ENTRIES: Array<{ label: string; icon: string; uri: string }> = [
  { label: "主页", icon: "/common/arealist_home.png", uri: "pages/app/features/main" },
  { label: "动态", icon: "/common/arealist_savedcontent.png", uri: "pages/app/features/dynamic" },
  { label: "搜索", icon: "/common/searchpage_search.png", uri: "pages/search/search" },
  { label: "消息", icon: "/common/arealist_updates.png", uri: "pages/message/messages" },
  { label: "我的", icon: "/common/arealist_my.png", uri: "pages/app/features/mypage" },
  { label: "收藏", icon: "/common/arealist_savedcontent.png", uri: "pages/app/features/savedcontent" },
  { label: "设置", icon: "/common/arealist_settings.png", uri: "pages/app/features/settings" },
];

export default function AreaList() {
  return (
    <PageShell>
      <Text className="mt-4 text-center text-base text-white">澎湃哔哩</Text>
      <View className="mt-4 flex w-full flex-row flex-wrap items-center justify-center">
        {ENTRIES.map((e) => (
          <View
            key={e.label}
            className="m-2 flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-gray-900"
            onClick={() => router.push({ uri: e.uri })}
          >
            <Image src={e.icon} className="h-8 w-8" />
            <Text className="mt-1 text-xs text-white">{e.label}</Text>
          </View>
        ))}
      </View>
    </PageShell>
  );
}

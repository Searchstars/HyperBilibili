import { Image, Text, View, router, useEffect, useState } from "@astralsight/astroforge-core";
import PageShell from "../../../shared/ui/PageShell";
import TitleBar from "../../../shared/ui/TitleBar";
import OnlineImage from "../../../shared/ui/OnlineImage";
import { state } from "../../../shared/api/state";

// "我的" 主页：用户卡片 + 入口列表（历史、收藏、消息、设置）。
export default function MyPage() {
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    setInfo(state.accountInfo);
  }, []);

  return (
    <PageShell>
      <TitleBar title="我的" />
      <View className="flex flex-row items-center px-4 py-3">
        <OnlineImage src={info?.face} className="h-12 w-12 overflow-hidden rounded-full" placeholder="/common/default_profile_img.png" />
        <View className="ml-3 flex flex-1 flex-col">
          <Text className="text-sm text-white">{info?.uname ?? "未登录"}</Text>
          <Text className="text-xs text-gray-400">Lv {info?.level_info?.current_level ?? 0}</Text>
        </View>
      </View>
      <Entry icon="/common/mypage_history.png" label="历史记录" uri="pages/folders/history" />
      <Entry icon="/common/mypage_star.png" label="收藏夹" uri="pages/folders/favfolders" />
      <Entry icon="/common/mypage_watchlater.png" label="稍后再看" uri="pages/folders/history" />
      <Entry icon="/common/mypage_messager.png" label="消息" uri="pages/message/messages" />
    </PageShell>
  );
}

function Entry(props: { icon: string; label: string; uri: string }) {
  return (
    <View className="flex flex-row items-center px-4 py-3" onClick={() => router.push({ uri: props.uri })}>
      <Image src={props.icon} className="h-5 w-5" />
      <Text className="ml-3 flex-1 text-sm text-white">{props.label}</Text>
      <Image src="/common/arrow_right.png" className="h-4 w-4" />
    </View>
  );
}

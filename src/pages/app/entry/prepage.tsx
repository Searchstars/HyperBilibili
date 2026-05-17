import { Text, View, router, useEffect, useState } from "@astralsight/astroforge-core";
import PageShell from "../../../shared/ui/PageShell";
import Loading from "../../../shared/ui/Loading";
import { checkUpdate } from "../../../shared/api/update";
import { getSettings } from "../../../shared/util/settings";

// 登录后的中转页：拉 update 检查 + 短暂展示之后进入 startupPage。
const PAGE_MAP: Record<string, string> = {
  主页: "pages/app/features/main",
  动态: "pages/app/features/dynamic",
  我的: "pages/app/features/mypage",
  搜索: "pages/search/search",
  消息: "pages/message/messages",
};

export default function PrePage() {
  const [tip, setTip] = useState("正在准备");

  useEffect(() => {
    (async () => {
      const update = await checkUpdate();
      if (update.hasUpdate) setTip(update.msg);
      // 留出 800ms 给用户看一眼提示；写死的等待是产品决策，不视为性能问题。
      setTimeout(() => {
        const target = PAGE_MAP[getSettings().startupPage] ?? "pages/app/arealist";
        router.replace({ uri: target });
      }, 800);
    })();
  }, []);

  return (
    <PageShell>
      <View className="flex h-full w-full flex-col items-center justify-center">
        <Loading text="" />
        <Text className="mt-4 px-6 text-center text-xs text-gray-300">{tip}</Text>
      </View>
    </PageShell>
  );
}

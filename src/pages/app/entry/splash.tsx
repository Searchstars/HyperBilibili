import { Image, Text, View, router, useEffect, useState } from "@astralsight/astroforge-core";
import PageShell from "../../../shared/ui/PageShell";
import { getSettings } from "../../../shared/util/settings";
import { ensureLogin } from "../../../shared/api/client";

// splash 仅展示 logo + 推进到下一步。三种分支：
//   1) 尚未同意协议  -> /eularead
//   2) 已同意但未登录 -> /login
//   3) 已登录       -> /prepage
//
// 不在这里发任何业务请求，把网络抖动延后到 prepage。

export default function Splash() {
  const [tip, setTip] = useState("启动中...");

  useEffect(() => {
    (async () => {
      const settings = getSettings();
      if (!settings.agreedAllAgreements) {
        setTip("欢迎使用");
        router.replace({ uri: "pages/app/entry/eularead" });
        return;
      }
      setTip("登录中...");
      const loggedIn = await ensureLogin();
      if (loggedIn) router.replace({ uri: "pages/app/entry/prepage" });
      else router.replace({ uri: "pages/app/entry/login" });
    })();
  }, []);

  return (
    <PageShell>
      <View className="flex h-full w-full flex-col items-center justify-center">
        <Image src="/common/logo96.png" className="h-24 w-24" />
        <Text className="mt-4 text-base text-white">澎湃哔哩</Text>
        <Text className="mt-1 text-xs text-gray-400">{tip}</Text>
      </View>
    </PageShell>
  );
}

import { Image, Text, View, router, useEffect, useState } from "@astralsight/astroforge-core";
import PageShell from "../../shared/ui/PageShell";
import TitleBar from "../../shared/ui/TitleBar";
import { messageUnreadFeed } from "../../shared/api/message";

// 消息中心：通知聚合 + 私信入口。
const SECTIONS: Array<{ key: string; label: string; icon: string }> = [
  { key: "reply", label: "回复我的", icon: "/common/messages_replyme.png" },
  { key: "at", label: "@我", icon: "/common/messages_atme.png" },
  { key: "like", label: "收到的赞", icon: "/common/messages_like.png" },
  { key: "dm", label: "私信", icon: "/common/messages_sound.png" },
];

export default function Messages() {
  const [feed, setFeed] = useState<any>(null);

  useEffect(() => {
    messageUnreadFeed().then(setFeed).catch(() => setFeed({}));
  }, []);

  return (
    <PageShell>
      <TitleBar title="消息" />
      <View className="flex flex-1 flex-col">
        {SECTIONS.map((s) => (
          <View
            key={s.key}
            className="flex flex-row items-center px-4 py-3"
            onClick={() => {
              if (s.key === "dm") router.push({ uri: "pages/message/dmlist" });
            }}
          >
            <Image src={s.icon} className="h-6 w-6" />
            <Text className="ml-3 flex-1 text-sm text-white">{s.label}</Text>
            <Text className="ml-2 text-xs text-pink-400">{feed?.[s.key] ?? 0}</Text>
          </View>
        ))}
      </View>
    </PageShell>
  );
}

import { List, ListItem, Text, View, router, useEffect, useState } from "@astralsight/astroforge-core";
import PageShell from "../../shared/ui/PageShell";
import TitleBar from "../../shared/ui/TitleBar";
import OnlineImage from "../../shared/ui/OnlineImage";
import Loading from "../../shared/ui/Loading";
import { dmSessions } from "../../shared/api/message";
import { getSettings } from "../../shared/util/settings";
import { multiUserInfo } from "../../shared/api/user";

// 私信会话列表。被置顶的用户排到最上。
export default function DmList() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [userMap, setUserMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await dmSessions(1, 0);
      const list: any[] = data?.session_list ?? [];
      const pinned = getSettings().pinnedDMUsers;
      list.sort((a, b) => {
        const ap = pinned.includes(String(a.talker_id)) ? 1 : 0;
        const bp = pinned.includes(String(b.talker_id)) ? 1 : 0;
        if (ap !== bp) return bp - ap;
        return (b.timestamp ?? 0) - (a.timestamp ?? 0);
      });
      setSessions(list);

      try {
        const users = await multiUserInfo(list.map((s) => s.talker_id));
        const map: Record<string, any> = {};
        for (const u of users ?? []) map[String(u.mid)] = u;
        setUserMap(map);
      } catch {
        // 用户信息拉不到不阻塞列表，展示默认头像即可
      }
      setLoading(false);
    })();
  }, []);

  return (
    <PageShell>
      <TitleBar title="私信" />
      {loading ? (
        <Loading text="加载会话" />
      ) : (
        <List className="flex-1 w-full">
          {sessions.map((s) => {
            const u = userMap[String(s.talker_id)] ?? {};
            return (
              <ListItem key={s.talker_id}>
                <View
                  className="flex flex-row items-center px-3 py-2"
                  onClick={() => router.push({ uri: "pages/message/dmpage", params: { mid: String(s.talker_id) } })}
                >
                  <OnlineImage src={u.face} className="h-10 w-10 overflow-hidden rounded-full" placeholder="/common/default_profile_img.png" />
                  <View className="ml-3 flex flex-1 flex-col">
                    <Text className="text-sm text-white">{u.name ?? "用户"}</Text>
                    <Text className="text-xs text-gray-400">{s.last_msg?.content ?? ""}</Text>
                  </View>
                  {s.unread_count > 0 ? (
                    <View className="ml-2 rounded-full bg-pink-500 px-2">
                      <Text className="text-xs text-white">{s.unread_count}</Text>
                    </View>
                  ) : null}
                </View>
              </ListItem>
            );
          })}
        </List>
      )}
    </PageShell>
  );
}

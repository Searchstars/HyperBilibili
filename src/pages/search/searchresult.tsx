import { List, ListItem, Text, View, useEffect, useState } from "@astralsight/astroforge-core";
import PageShell from "../../shared/ui/PageShell";
import TitleBar from "../../shared/ui/TitleBar";
import SwitchBar from "../../shared/ui/SwitchBar";
import VideoCard from "../../shared/ui/VideoCard";
import UserInfo from "../../shared/ui/UserInfo";
import Loading from "../../shared/ui/Loading";
import ErrorView from "../../shared/ui/ErrorView";
import { searchAll } from "../../shared/api/search";

interface Route {
  params?: { keyword?: string };
}

const TABS = ["视频", "用户"];

export default function SearchResult(props: Route) {
  const keyword = props?.params?.keyword ?? "";
  const [tab, setTab] = useState(0);
  const [videos, setVideos] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await searchAll(keyword, 20);
        setVideos(res.videos);
        setUsers(res.users);
      } catch {
        setError("搜索失败");
      }
      setLoading(false);
    })();
  }, []);

  return (
    <PageShell>
      <TitleBar title={keyword} />
      <SwitchBar items={TABS} active={tab} onChange={setTab} />
      {loading ? (
        <Loading text="搜索中" />
      ) : error ? (
        <ErrorView message={error} />
      ) : tab === 0 ? (
        <List className="flex-1 w-full">
          {videos.map((v) => (
            <ListItem key={v.bvid}>
              <VideoCard bvid={v.bvid} title={stripEm(v.title)} cover={v.pic} duration={parseDur(v.duration)} upName={v.author} views={v.play} />
            </ListItem>
          ))}
        </List>
      ) : (
        <List className="flex-1 w-full">
          {users.map((u) => (
            <ListItem key={u.mid}>
              <View className="px-3 py-2">
                <UserInfo mid={u.mid} name={u.uname} face={u.upic ?? `https:${u.upic ?? ""}`} />
              </View>
            </ListItem>
          ))}
        </List>
      )}
    </PageShell>
  );
}

// B 站 search title 字段里夹带 <em class="keyword">高亮</em>，这里去掉。
function stripEm(s: string): string {
  return (s ?? "").replace(/<\/?em[^>]*>/g, "");
}

// duration 字段格式 "12:34"；转秒。
function parseDur(s: string): number {
  if (!s) return 0;
  const parts = s.split(":").map((n) => Number.parseInt(n, 10) || 0);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

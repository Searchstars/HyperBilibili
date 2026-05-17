import { List, ListItem, Text, View, router, useEffect, useState } from "@astralsight/astroforge-core";
import PageShell from "../../shared/ui/PageShell";
import TitleBar from "../../shared/ui/TitleBar";
import OnlineImage from "../../shared/ui/OnlineImage";
import Loading from "../../shared/ui/Loading";
import { getUserFavFolders } from "../../shared/api/folder";
import { state } from "../../shared/api/state";

// 收藏夹列表。点击进入 foldervideos。
export default function FavFolders() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const mid = state.accountInfo?.mid;
      if (!mid) return setLoading(false);
      try {
        const data = await getUserFavFolders(mid);
        setList(data?.list ?? []);
      } catch {
        setList([]);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <PageShell>
      <TitleBar title="收藏夹" />
      {loading ? (
        <Loading text="加载" />
      ) : (
        <List className="flex-1 w-full">
          {list.map((f) => (
            <ListItem key={f.id}>
              <View
                className="flex flex-row items-center px-3 py-2"
                onClick={() => router.push({ uri: "pages/folders/favfolders/foldervideos", params: { mlid: String(f.id), title: f.title } })}
              >
                <OnlineImage src={f.cover} className="h-12 w-16 rounded" />
                <View className="ml-3 flex flex-1 flex-col">
                  <Text className="text-sm text-white">{f.title}</Text>
                  <Text className="text-xs text-gray-400">{f.media_count} 个内容</Text>
                </View>
              </View>
            </ListItem>
          ))}
        </List>
      )}
    </PageShell>
  );
}

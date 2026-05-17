import { List, ListItem, Text, View, router, useEffect, useState } from "@astralsight/astroforge-core";
import PageShell from "../../../shared/ui/PageShell";
import TitleBar from "../../../shared/ui/TitleBar";
import OnlineImage from "../../../shared/ui/OnlineImage";
import { listSaved } from "../../../shared/util/savedcontent";
import { formatDate } from "../../../shared/util/format";

// 离线收藏的内容列表。
export default function SavedContent() {
  const [items, setItems] = useState<ReturnType<typeof listSaved>>([]);

  useEffect(() => {
    setItems(listSaved());
  }, []);

  return (
    <PageShell>
      <TitleBar title="离线内容" />
      {items.length === 0 ? (
        <View className="flex h-full w-full items-center justify-center">
          <Text className="text-sm text-gray-400">还没有保存任何内容</Text>
        </View>
      ) : (
        <List className="flex-1 w-full">
          {items.map((it) => (
            <ListItem key={it.id}>
              <View
                className="flex flex-row items-center px-3 py-2"
                onClick={() => {
                  if (it.kind === "article") router.push({ uri: "pages/article/articleshow", params: { cvid: it.id } });
                  else router.push({ uri: "pages/video/videodetail", params: { bvid: it.id } });
                }}
              >
                <OnlineImage src={it.cover} className="h-12 w-16 rounded" />
                <View className="ml-3 flex flex-1 flex-col">
                  <Text className="text-sm text-white">{it.title}</Text>
                  <Text className="mt-1 text-xs text-gray-400">{formatDate(it.savedAt)}</Text>
                </View>
              </View>
            </ListItem>
          ))}
        </List>
      )}
    </PageShell>
  );
}

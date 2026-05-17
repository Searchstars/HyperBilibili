import { List, ListItem, Text, View, useEffect, useState } from "@astralsight/astroforge-core";
import PageShell from "../../../shared/ui/PageShell";
import TitleBar from "../../../shared/ui/TitleBar";
import VideoCard from "../../../shared/ui/VideoCard";
import Loading from "../../../shared/ui/Loading";
import { favFolderContent } from "../../../shared/api/folder";

interface Route {
  params?: { mlid?: string; title?: string };
}

export default function FolderVideos(props: Route) {
  const mlid = props?.params?.mlid ?? "";
  const title = props?.params?.title ?? "收藏夹";
  const [items, setItems] = useState<any[]>([]);
  const [pn, setPn] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mlid) return;
    (async () => {
      const data = await favFolderContent(mlid, pn, 20);
      setItems(data?.medias ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <PageShell>
      <TitleBar title={title} />
      {loading ? (
        <Loading />
      ) : (
        <List className="flex-1 w-full">
          {items.map((m) => (
            <ListItem key={m.id}>
              <VideoCard bvid={m.bvid} title={m.title} cover={m.cover} duration={m.duration} upName={m.upper?.name} views={m.cnt_info?.play} />
            </ListItem>
          ))}
        </List>
      )}
    </PageShell>
  );
}

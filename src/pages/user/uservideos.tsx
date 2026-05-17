import { List, ListItem, useEffect, useState } from "@astralsight/astroforge-core";
import PageShell from "../../shared/ui/PageShell";
import TitleBar from "../../shared/ui/TitleBar";
import VideoCard from "../../shared/ui/VideoCard";
import Loading from "../../shared/ui/Loading";
import { userVideos } from "../../shared/api/user";

interface Route {
  params?: { mid?: string };
}

export default function UserVideos(props: Route) {
  const mid = props?.params?.mid ?? "";
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!mid) return;
      const data = await userVideos(mid, 1, 20);
      setItems(data?.list?.vlist ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <PageShell>
      <TitleBar title="投稿" />
      {loading ? (
        <Loading />
      ) : (
        <List className="flex-1 w-full">
          {items.map((v) => (
            <ListItem key={v.bvid}>
              <VideoCard bvid={v.bvid} title={v.title} cover={v.pic} duration={v.length} upName={v.author} views={v.play} />
            </ListItem>
          ))}
        </List>
      )}
    </PageShell>
  );
}

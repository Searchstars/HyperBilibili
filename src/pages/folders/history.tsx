import { List, ListItem, useEffect, useState } from "@astralsight/astroforge-core";
import PageShell from "../../shared/ui/PageShell";
import TitleBar from "../../shared/ui/TitleBar";
import VideoCard from "../../shared/ui/VideoCard";
import Loading from "../../shared/ui/Loading";
import { watchHistory } from "../../shared/api/history";

export default function History() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await watchHistory(1, 20);
      setItems(data?.list ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <PageShell>
      <TitleBar title="历史记录" />
      {loading ? (
        <Loading />
      ) : (
        <List className="flex-1 w-full">
          {items.map((m) => (
            <ListItem key={m.kid ?? m.history?.bvid}>
              <VideoCard bvid={m.history?.bvid} title={m.title} cover={m.cover} duration={m.duration} upName={m.author_name} views={m.view_at} />
            </ListItem>
          ))}
        </List>
      )}
    </PageShell>
  );
}

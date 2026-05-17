import { List, ListItem, useEffect, useState } from "@astralsight/astroforge-core";
import PageShell from "../../shared/ui/PageShell";
import TitleBar from "../../shared/ui/TitleBar";
import DynShow from "../../shared/ui/DynShow";
import Loading from "../../shared/ui/Loading";
import { userDynamic } from "../../shared/api/user";

interface Route {
  params?: { mid?: string };
}

export default function UserDynamic(props: Route) {
  const mid = props?.params?.mid ?? "";
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!mid) return;
      const data = await userDynamic(mid);
      setItems(data?.items ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <PageShell>
      <TitleBar title="动态" />
      {loading ? (
        <Loading />
      ) : (
        <List className="flex-1 w-full">
          {items.map((it) => (
            <ListItem key={it.id_str}>
              <DynShow item={it} />
            </ListItem>
          ))}
        </List>
      )}
    </PageShell>
  );
}

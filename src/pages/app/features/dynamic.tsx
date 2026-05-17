import { List, ListItem, Text, View, useEffect, useState } from "@astralsight/astroforge-core";
import PageShell from "../../../shared/ui/PageShell";
import TitleBar from "../../../shared/ui/TitleBar";
import DynShow from "../../../shared/ui/DynShow";
import Loading from "../../../shared/ui/Loading";
import ErrorView from "../../../shared/ui/ErrorView";
import { dynamicFeed } from "../../../shared/api/dynamic";

// 动态时间线。下拉刷新交给 Refresh 组件，IFS 接 offset。
export default function DynamicPage() {
  const [items, setItems] = useState<any[]>([]);
  const [offset, setOffset] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPage();
  }, []);

  const fetchPage = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await dynamicFeed(0, offset);
      setItems(data?.items ?? []);
      setOffset(data?.offset ?? "");
    } catch {
      setError("加载失败");
    }
    setLoading(false);
  };

  return (
    <PageShell>
      <TitleBar title="动态" />
      {loading ? (
        <Loading text="加载动态" />
      ) : error ? (
        <ErrorView message={error} retryLabel="重试" onRetry={fetchPage} />
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

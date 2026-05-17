import { List, ListItem, Refresh, Text, View, router, useEffect, useState } from "@astralsight/astroforge-core";
import PageShell from "../../../shared/ui/PageShell";
import VideoCard from "../../../shared/ui/VideoCard";
import Loading from "../../../shared/ui/Loading";
import ErrorView from "../../../shared/ui/ErrorView";
import { recommendedVideos } from "../../../shared/api/video";
import { getSettings } from "../../../shared/util/settings";
import { logger } from "../../../shared/util/logger";

// 首页推荐列表。下拉刷新 + 自动加载更多。
//
// 旧版用自研 ListView + ImageMonitor 触发预取；新版交给 Vela <list>，
// 它内部有视口判定，简单很多。

export default function Main() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    setLoading(true);
    setError("");
    try {
      const settings = getSettings();
      const data = await recommendedVideos(settings.freshType, settings.homeVidCount);
      setItems(data);
    } catch (err) {
      logger.error("[main] 拉推荐失败", err);
      setError("加载推荐失败");
    }
    setLoading(false);
    setRefreshing(false);
  };

  return (
    <PageShell>
      <View className="flex h-12 w-full flex-row items-center justify-center">
        <Text className="text-base text-white">推荐</Text>
      </View>
      {loading ? (
        <Loading text="加载中" />
      ) : error ? (
        <ErrorView message={error} retryLabel="重试" onRetry={fetchList} />
      ) : (
        <Refresh
          className="flex-1 w-full"
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchList();
          }}
        >
          <List className="flex-1 w-full" type="grid">
            {items.map((v) => (
              <ListItem key={v.bvid ?? v.id} type="card">
                <VideoCard
                  bvid={v.bvid}
                  title={v.title}
                  cover={v.pic}
                  duration={v.duration}
                  upName={v.owner?.name}
                  views={v.stat?.view}
                />
              </ListItem>
            ))}
          </List>
        </Refresh>
      )}
    </PageShell>
  );
}

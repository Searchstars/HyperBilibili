import { Image, List, ListItem, Text, View, router, useEffect, useState } from "@astralsight/astroforge-core";
import PageShell from "../../shared/ui/PageShell";
import TitleBar from "../../shared/ui/TitleBar";
import Reply from "../../shared/ui/Reply";
import Loading from "../../shared/ui/Loading";
import ErrorView from "../../shared/ui/ErrorView";
import { getReplies } from "../../shared/api/comment";

interface Route {
  params?: { type?: string; oid?: string };
}

// 评论列表页。type=1 视频评论；type=12 专栏评论。
export default function Replys(props: Route) {
  const type = props?.params?.type ?? "1";
  const oid = props?.params?.oid ?? "";
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!oid) {
      setError("缺少 oid");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const data = await getReplies(type, oid, 1, 20, 2);
        setList(data?.replies ?? []);
      } catch {
        setError("加载评论失败");
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <PageShell>
        <TitleBar title="评论" />
        <Loading />
      </PageShell>
    );
  }
  if (error) {
    return (
      <PageShell>
        <TitleBar title="评论" />
        <ErrorView message={error} />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <TitleBar title="评论">
        <Image
          src="/common/featurebtn_replyarea.png"
          className="h-5 w-5"
          onClick={() => router.push({ uri: "pages/reply/replytools", params: { type, oid } })}
        />
      </TitleBar>
      <List className="flex-1 w-full">
        {list.map((r) => (
          <ListItem key={r.rpid}>
            <Reply item={r} />
          </ListItem>
        ))}
      </List>
    </PageShell>
  );
}

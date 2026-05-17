import { Scroll, Text, View, useEffect, useState } from "@astralsight/astroforge-core";
import PageShell from "../../../../shared/ui/PageShell";
import TitleBar from "../../../../shared/ui/TitleBar";
import DynShow from "../../../../shared/ui/DynShow";
import Loading from "../../../../shared/ui/Loading";
import ErrorView from "../../../../shared/ui/ErrorView";
import { dynamicDetail } from "../../../../shared/api/dynamic";

interface Route {
  params?: { id?: string };
}

export default function DynamicDetail(props: Route) {
  const id = props?.params?.id ?? "";
  const [item, setItem] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      if (!id) {
        setError("缺少动态 id");
        return;
      }
      try {
        const data = await dynamicDetail(id);
        setItem(data?.item);
      } catch {
        setError("加载失败");
      }
    })();
  }, []);

  return (
    <PageShell>
      <TitleBar title="动态详情" />
      {error ? (
        <ErrorView message={error} />
      ) : item == null ? (
        <Loading text="加载中" />
      ) : (
        <Scroll className="flex-1 w-full" scrollY={true}>
          <DynShow item={item} />
        </Scroll>
      )}
    </PageShell>
  );
}

import { Scroll, Text, View } from "@astralsight/astroforge-core";
import PageShell from "../../shared/ui/PageShell";
import TitleBar from "../../shared/ui/TitleBar";

interface Route {
  params?: { text?: string; title?: string };
}

// 通用文本详情页。
export default function TextDetail(props: Route) {
  const title = props?.params?.title ?? "详情";
  const text = props?.params?.text ?? "";
  return (
    <PageShell>
      <TitleBar title={title.slice(0, 8)} />
      <Scroll className="flex-1 w-full" scrollY={true}>
        <Text className="mx-3 my-3 text-sm text-white">{text}</Text>
      </Scroll>
    </PageShell>
  );
}

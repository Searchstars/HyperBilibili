import { View } from "@astralsight/astroforge-core";
import PageShell from "../../shared/ui/PageShell";
import TitleBar from "../../shared/ui/TitleBar";
import OnlineImage from "../../shared/ui/OnlineImage";

interface Route {
  params?: { src?: string };
}

// 全屏单图查看。简单包一层；Vela image 自身不支持 pinch zoom，先保留旧版的
// fit-contain 形态。
export default function PictureDetail(props: Route) {
  const src = props?.params?.src ?? "";
  return (
    <PageShell>
      <TitleBar title="图片" />
      <View className="flex flex-1 items-center justify-center">
        <OnlineImage src={src} className="h-full w-full" />
      </View>
    </PageShell>
  );
}

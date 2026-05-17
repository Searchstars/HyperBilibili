import { Image, Scroll, Text, View, router, useEffect, useState } from "@astralsight/astroforge-core";
import PageShell from "../../shared/ui/PageShell";
import TitleBar from "../../shared/ui/TitleBar";
import OnlineImage from "../../shared/ui/OnlineImage";
import Loading from "../../shared/ui/Loading";
import { userInfo, userStat } from "../../shared/api/user";
import { formatNumber } from "../../shared/util/format";

interface Route {
  params?: { mid?: string };
}

export default function UserPage(props: Route) {
  const mid = props?.params?.mid ?? "";
  const [info, setInfo] = useState<any>(null);
  const [stat, setStat] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (!mid) return;
      const [i, s] = await Promise.all([userInfo(mid), userStat(mid)]);
      setInfo(i);
      setStat(s);
    })();
  }, []);

  if (info == null) {
    return (
      <PageShell>
        <TitleBar title="用户" />
        <Loading />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <TitleBar title={info.name ?? "用户"} />
      <Scroll className="flex-1 w-full" scrollY={true}>
        <View className="flex flex-col items-center py-4">
          <OnlineImage src={info.face} className="h-20 w-20 overflow-hidden rounded-full" placeholder="/common/default_profile_img.png" />
          <Text className="mt-2 text-base text-white">{info.name}</Text>
          {info.sign ? <Text className="mx-6 mt-1 text-center text-xs text-gray-400">{info.sign}</Text> : null}
          <View className="mt-3 flex flex-row items-center justify-between px-4">
            <Stat label="粉丝" value={stat?.follower} />
            <Stat label="关注" value={stat?.following} />
          </View>
        </View>
        <View className="mt-2 flex flex-col">
          <Entry label="TA 的投稿" onClick={() => router.push({ uri: "pages/user/uservideos", params: { mid: String(mid) } })} />
          <Entry label="TA 的动态" onClick={() => router.push({ uri: "pages/user/userdynamic", params: { mid: String(mid) } })} />
        </View>
      </Scroll>
    </PageShell>
  );
}

function Stat(props: { label?: string; value?: number }) {
  return (
    <View className="mx-3 flex flex-col items-center">
      <Text className="text-sm text-white">{formatNumber(props.value ?? 0)}</Text>
      <Text className="mt-1 text-xs text-gray-400">{props.label ?? ""}</Text>
    </View>
  );
}

function Entry(props: { label?: string; onClick?: () => void }) {
  return (
    <View className="flex flex-row items-center px-4 py-3" onClick={props.onClick}>
      <Text className="flex-1 text-sm text-white">{props.label ?? ""}</Text>
      <Image src="/common/arrow_right.png" className="h-4 w-4" />
    </View>
  );
}

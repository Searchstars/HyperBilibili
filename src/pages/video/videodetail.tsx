import { Image, Scroll, Text, View, prompt, router, useEffect, useState } from "@astralsight/astroforge-core";
import PageShell from "../../shared/ui/PageShell";
import OnlineImage from "../../shared/ui/OnlineImage";
import TitleBar from "../../shared/ui/TitleBar";
import Loading from "../../shared/ui/Loading";
import ErrorView from "../../shared/ui/ErrorView";
import UserInfo from "../../shared/ui/UserInfo";
import {
  coinVideo,
  isVideoCoined,
  isVideoLiked,
  isVideoStared,
  likeVideo,
  starVideoToDefault,
  videoInfoByBVID,
} from "../../shared/api/video";
import { formatDuration, formatNumber } from "../../shared/util/format";
import { logger } from "../../shared/util/logger";

// 视频详情页。展示封面 / 标题 / UP / 三连按钮 / 简介；点击评论入口跳 /replys。
//
// 旧版会在封面就绪时跑自研 k-means 取色生成渐变 bg；新版改用 onComplete 回调
// 触发一个简单的 fade-in 类切换，复杂取色等真要做的话再用 worker。

interface Route {
  params?: { bvid?: string };
}

export default function VideoDetail(props: Route) {
  const bvid = props?.params?.bvid ?? "";
  const [info, setInfo] = useState<any>(null);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [coined, setCoined] = useState(false);
  const [stared, setStared] = useState(false);
  const [coverReady, setCoverReady] = useState(false);

  useEffect(() => {
    (async () => {
      if (!bvid) {
        setError("缺少 bvid");
        return;
      }
      try {
        const data = await videoInfoByBVID(bvid);
        setInfo(data);
        const [li, co, st] = await Promise.all([
          isVideoLiked(bvid),
          isVideoCoined(bvid),
          isVideoStared(bvid),
        ]);
        setLiked(li);
        setCoined(co);
        setStared(st);
      } catch (err) {
        logger.error("[videodetail] 加载失败", err);
        setError("加载失败");
      }
    })();
  }, []);

  const doLike = async () => {
    const ok = await likeVideo(bvid, liked ? 0 : 1);
    if (ok?.code === 0) setLiked(!liked);
  };
  const doCoin = async () => {
    if (coined) return;
    const ok = await coinVideo(bvid, 1);
    if (ok?.code === 0) setCoined(true);
  };
  const doStar = async () => {
    const ok = await starVideoToDefault(bvid);
    if (ok) setStared(!stared);
    else (prompt as any).showToast({ message: "收藏失败" });
  };

  if (error) {
    return (
      <PageShell>
        <TitleBar title="视频" />
        <ErrorView message={error} />
      </PageShell>
    );
  }
  if (info == null) {
    return (
      <PageShell>
        <TitleBar title="视频" />
        <Loading text="加载视频" />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <TitleBar title={info.title?.slice(0, 8) ?? "视频"} />
      <Scroll className="flex-1 w-full" scrollY={true}>
        <View className="relative h-44 w-full">
          <OnlineImage
            src={info.pic}
            className={`h-full w-full ${coverReady ? "opacity-100" : "opacity-0"}`}
            onComplete={() => setCoverReady(true)}
          />
          {info.duration ? (
            <View className="absolute bottom-2 right-2 rounded bg-black/60 px-2">
              <Text className="text-xs text-white">{formatDuration(info.duration)}</Text>
            </View>
          ) : null}
        </View>
        <Text className="mx-3 mt-2 text-sm text-white">{info.title}</Text>
        <View className="mx-3 mt-2">
          <UserInfo mid={info.owner?.mid} name={info.owner?.name} face={info.owner?.face} />
        </View>
        <View className="mx-3 mt-3 flex flex-row items-center justify-between">
          <ActionBtn icon={liked ? "/common/vidtool_liked.png" : "/common/vidtool_like.png"} label={formatNumber(info.stat?.like ?? 0)} onClick={doLike} />
          <ActionBtn icon={coined ? "/common/vidtool_coined.png" : "/common/vidtool_coin.png"} label={formatNumber(info.stat?.coin ?? 0)} onClick={doCoin} />
          <ActionBtn icon={stared ? "/common/vidtool_stared.png" : "/common/vidtool_star.png"} label={formatNumber(info.stat?.favorite ?? 0)} onClick={doStar} />
          <ActionBtn
            icon="/common/featurebtn_replyarea.png"
            label={formatNumber(info.stat?.reply ?? 0)}
            onClick={() => router.push({ uri: "pages/reply/replys", params: { type: "1", oid: String(info.aid) } })}
          />
        </View>
        {info.desc ? (
          <View className="mx-3 mt-4">
            <Text className="text-xs text-gray-300">{info.desc}</Text>
          </View>
        ) : null}
      </Scroll>
    </PageShell>
  );
}

interface ActionBtnProps {
  icon: string;
  label: string;
  onClick?: () => void;
}

function ActionBtn({ icon, label, onClick }: ActionBtnProps) {
  return (
    <View className="flex flex-col items-center" onClick={onClick}>
      <Image src={icon} className="h-6 w-6" />
      <Text className="mt-1 text-xs text-gray-300">{label}</Text>
    </View>
  );
}

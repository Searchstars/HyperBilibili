import { Image, router, useState, View } from "@astralsight/astroforge-core";
import { useDeviceInfo } from "@shared/hooks/useDeviceInfo";

const STEPS_MAP: Record<string, string[]> = {
  circle: [
    "/common/guides/circle/1_welcome.png",
    "/common/guides/circle/2_switchPage.png",
    "/common/guides/circle/3_enterSearch.png",
    "/common/guides/circle/4_videoDetailMoreFeatures.png",
    "/common/guides/circle/5_replyMoreFeatures.png",
    "/common/guides/circle/6_dontsupportvideoplay.png",
  ],
  "pill-shaped": [
    "/common/guides/pill-shaped/1_welcome.png",
    "/common/guides/pill-shaped/2_switchPage.png",
    "/common/guides/pill-shaped/3_videoDetailMoreFeatures.png",
  ],
  rect: [
    "/common/guides/circle/1_welcome.png",
    "/common/guides/circle/2_switchPage.png",
    "/common/guides/circle/3_enterSearch.png",
    "/common/guides/circle/4_videoDetailMoreFeatures.png",
    "/common/guides/circle/5_replyMoreFeatures.png",
    "/common/guides/circle/6_dontsupportvideoplay.png",
  ],
};

/**
 * 引导页 —— 对齐旧版 introduction.ux：根据 screenShape 选 steps，
 * 点屏幕推进步骤；到底跳 main。
 */
export default function IntroductionPage() {
  const device = useDeviceInfo();
  const shape = (device?.screenShape as string) || "circle";
  const steps = STEPS_MAP[shape] ?? STEPS_MAP.circle;
  const [step, setStep] = useState(0);

  const handleClick = () => {
    const next = step + 1;
    if (next >= steps.length) {
      router.replace({ uri: "pages/app/features/main" });
    } else {
      setStep(next);
    }
  };

  return (
    <View
      className="flex-col items-center justify-center w-full h-full"
      style={{ backgroundColor: "#000000" }}
    >
      <Image
        src={steps[step] ?? steps[0]}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        onClick={handleClick}
      />
    </View>
  );
}

export const lifecycle = {
  onInit() {
    console.log("[introduction] onInit");
  },
};

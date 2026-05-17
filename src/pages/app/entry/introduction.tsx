import { Image, Text, View, router, useState } from "@astralsight/astroforge-core";
import PageShell from "../../../shared/ui/PageShell";
import Button from "../../../shared/ui/Button";

// 三屏引导。手动维护一个 step 计数器，到 3 之后跳登录。
// 旧版自研横向 swiper + 滑动手势，新版改为按钮推进，调试与单测更直接。

const STEPS = [
  { title: "澎湃哔哩", desc: "在 Vela 设备上浏览 B 站内容", icon: "/common/logo96.png" },
  { title: "扫码登录", desc: "用 B 站官方 App 扫码即可使用", icon: "/common/arealist_my.png" },
  { title: "享受其中", desc: "视频 / 动态 / 私信 / 收藏", icon: "/common/arealist_home.png" },
];

export default function Introduction() {
  const [step, setStep] = useState(0);

  const next = () => {
    if (step >= STEPS.length - 1) {
      router.replace({ uri: "pages/app/entry/login" });
      return;
    }
    setStep(step + 1);
  };

  const current = STEPS[step] ?? STEPS[0];

  return (
    <PageShell>
      <View className="flex h-full w-full flex-col items-center justify-center px-4">
        <Image src={current.icon} className="h-20 w-20" />
        <Text className="mt-4 text-lg text-white">{current.title}</Text>
        <Text className="mt-2 text-center text-sm text-gray-300">{current.desc}</Text>
        <View className="mt-8 flex flex-row items-center justify-center">
          {STEPS.map((s, idx) => (
            <View
              key={s.title}
              className={`mx-1 h-2 w-2 rounded-full ${idx === step ? "bg-pink-500" : "bg-gray-600"}`}
            />
          ))}
        </View>
        <View className="mt-6">
          <Button label={step >= STEPS.length - 1 ? "开始使用" : "下一步"} onClick={next} />
        </View>
      </View>
    </PageShell>
  );
}

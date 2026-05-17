import { Image, router, useEffect, useState, View } from "@astralsight/astroforge-core";
import { SETTINGS } from "@shared/settings";
import { jumpAfterEula } from "@shared/utils/jumpcheck";
import { networkCheck } from "@shared/utils/tools";

/**
 * Splash 页面 —— 对齐旧版 pages/app/entry/splash.ux：
 *   1. logo 从屏幕底部 marginTop=800px 滑入（DomAnim, 100ms）
 *   2. 停留 ~1000ms
 *   3. logo 滑回底部（100ms）
 *   4. 500ms 后：网络检查 → eularead / 跳过协议直接 jumpAfterEula；无网 → networkerror
 */
export default function SplashPage() {
  const [marginTop, setMarginTop] = useState(800);

  useEffect(() => {
    let raf1: ReturnType<typeof setTimeout> | null = null;
    let raf2: ReturnType<typeof setTimeout> | null = null;
    let raf3: ReturnType<typeof setTimeout> | null = null;
    let stepInterval: ReturnType<typeof setInterval> | null = null;
    let alive = true;

    const animateTo = (from: number, to: number, duration: number, cb?: () => void) => {
      const start = Date.now();
      stepInterval = setInterval(() => {
        if (!alive) return;
        const elapsed = Date.now() - start;
        if (elapsed >= duration) {
          setMarginTop(to);
          clearInterval(stepInterval!);
          stepInterval = null;
          cb?.();
        } else {
          const progress = elapsed / duration;
          setMarginTop(from + (to - from) * progress);
        }
      }, 16);
    };

    // 入场：800 → 0 (100ms)
    animateTo(800, 0, 100, () => {
      // 停留 1000ms 后开始出场
      raf1 = setTimeout(() => {
        animateTo(0, 800, 100, () => {
          // 出场完毕，500ms 后判路由
          raf2 = setTimeout(async () => {
            const ok = await networkCheck();
            if (!ok) {
              router.replace({ uri: "pages/error/networkerror" });
              return;
            }
            if (!SETTINGS.agreedAllAgreements) {
              router.replace({ uri: "pages/app/entry/eularead" });
            } else {
              jumpAfterEula();
            }
          }, 500);
        });
      }, 1000);
    });

    return () => {
      alive = false;
      if (stepInterval) clearInterval(stepInterval);
      if (raf1) clearTimeout(raf1);
      if (raf2) clearTimeout(raf2);
      if (raf3) clearTimeout(raf3);
    };
  }, []);

  return (
    <View
      className="flex-col items-center justify-center w-full h-full"
      style={{
        position: "absolute",
        backgroundColor: "#000000",
      }}
    >
      <Image
        src="/common/logo.png"
        style={{
          marginTop: `${Math.round(marginTop)}px`,
          marginLeft: "0px",
        }}
      />
    </View>
  );
}

export const lifecycle = {
  onInit() {
    console.log("[splash] onInit");
  },
};

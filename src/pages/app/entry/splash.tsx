import { Image, router, useEffect, useState, View } from "@astralsight/astroforge-core";
import { SETTINGS as settingsStore } from "../../../shared/settings";
import { jumpAfterEula } from "../../../shared/utils/jumpcheck";
import { networkCheck } from "../../../shared/utils/tools";

/**
 * Splash 页面（AstroForge 静态 IR 友好版本）—— 对齐旧版 splash.ux 节奏：
 *   1. logo 从 marginTop=800 滑入到 0（100ms）
 *   2. 停留 1000ms
 *   3. 滑回 800（100ms）
 *   4. 500ms 后判网络 → eularead / jumpAfterEula / networkerror
 *
 * AstroForge 0.0.11 的静态分析只能把 setX(literal) / setX((prev) => prev + literal)
 * 形式的调用 lower 成 Vela 的 `this.x = ...` 赋值。所以这里把每一步都拆成
 * useEffect 里平铺的 setTimeout/setInterval，避免嵌套闭包。
 */
export default function splash() {
  const [marginTop, setMarginTop] = useState(800);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Phase 0：800 → 0，100ms，~6 步
    const enterInterval = setInterval(() => {
      setMarginTop((prev) => Math.max(prev - 130, 0));
    }, 16);
    setTimeout(() => {
      clearInterval(enterInterval);
      setMarginTop(0);
      setPhase(1);
    }, 100);

    // Phase 1：停留 1000ms 后开始出场
    setTimeout(() => {
      const exitInterval = setInterval(() => {
        setMarginTop((prev) => Math.min(prev + 130, 800));
      }, 16);
      setTimeout(() => {
        clearInterval(exitInterval);
        setMarginTop(800);
        setPhase(2);
      }, 100);
    }, 1100);

    // Phase 2：出场结束 500ms 后判路由
    setTimeout(() => {
      networkCheck().then((ok) => {
        if (!ok) {
          router.replace({ uri: "pages/error/networkerror" });
          return;
        }
        if (!settingsStore.agreedAllAgreements) {
          router.replace({ uri: "pages/app/entry/eularead" });
        } else {
          jumpAfterEula();
        }
      });
    }, 1700);
  });

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
          marginTop: marginTop + "px",
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

import { Image, router, Text, useEffect, useState, View } from "@astralsight/astroforge-core";
import { Button } from "@shared/ui/Button";
import { t } from "@shared/i18n";
import { SETTINGS } from "@shared/settings";
import { state } from "@shared/state";

/**
 * PrePage —— 对齐旧版 prepage.ux：
 *   - 显示"正在加载账号数据..."
 *   - 静默调用 login(false)：用本地 cookie 拉账号信息
 *   - 完成后按 SETTINGS.startupPage 跳转：主页 / 私信 / 菜单
 *   - 5 秒后展示"重新登录"按钮
 *
 * 序列动画原本是 28 帧 sequence；新版用 GIF 替代。若 GIF 暂未生成，
 * 回落到序列帧第 1 帧静态图。
 */
export default function PrePage() {
  const [showReLogin, setShowReLogin] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const bili = state.biliclient;
        if (!bili) {
          console.warn("[prepage] biliclient not ready");
          return;
        }
        await bili.login(false, null);
        switch (SETTINGS.startupPage) {
          case "主页":
            router.replace({ uri: "pages/app/features/main" });
            break;
          case "私信":
            router.replace({ uri: "pages/app/features/mypage" });
            setTimeout(() => router.push({ uri: "pages/message/dmlist" }), 1000);
            break;
          case "菜单":
            router.replace({ uri: "pages/app/arealist" });
            break;
          default:
            router.replace({ uri: "pages/app/features/main" });
        }
      } catch (e) {
        console.error("[prepage] login err", e);
      }
    })();

    const t1 = setTimeout(() => setShowReLogin(true), 5000);
    return () => clearTimeout(t1);
  }, []);

  const handleReLogin = () => {
    state.biliclient?.logOut();
    router.clear();
    router.replace({ uri: "pages/app/entry/splash" });
  };

  return (
    <View
      className="flex-col items-center justify-center w-full h-full"
      style={{
        backgroundColor: "#000000",
        position: "absolute",
      }}
    >
      <Image
        src="/common/seqanims/loginWhite/icons8-login-1.png"
        style={{ width: "45px", height: "45px", objectFit: "contain" }}
      />
      <Text
        className="text-white"
        style={{ fontWeight: "600", fontSize: "24px", marginTop: "10px" }}
      >
        {t("prepage.loadingTip")}
      </Text>
      {showReLogin && (
        <View style={{ position: "absolute", bottom: "50px" }}>
          <Button text="prepage.gotProblems" onClick={handleReLogin} />
        </View>
      )}
    </View>
  );
}

export const lifecycle = {
  onInit() {
    console.log("[prepage] onInit");
  },
};

import { prompt, Qr, router, Text, useEffect, useRef, useState, View } from "@astralsight/astroforge-core";
import { Loading } from "@shared/ui/Loading";
import { t } from "@shared/i18n";
import { state } from "@shared/state";

/**
 * 登录页 —— 对齐旧版 login.ux：
 *   - 入场：div marginTop 800 → 0 (250ms)
 *   - GetQR：拉取二维码 URL，1500ms 间隔轮询登录状态
 *   - 登录成功 → toast + 跳 introduction
 */
export default function LoginPage() {
  const [marginTop, setMarginTop] = useState(800);
  const [qrValue, setQrValue] = useState("");
  const [showQr, setShowQr] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // 入场动画 800→0, 250ms
    const start = Date.now();
    const animId = setInterval(() => {
      const elapsed = Date.now() - start;
      if (elapsed >= 250) {
        setMarginTop(0);
        clearInterval(animId);
      } else {
        setMarginTop(800 + (0 - 800) * (elapsed / 250));
      }
    }, 16);

    // 拉 QR
    (async () => {
      try {
        const bili = state.biliclient;
        if (!bili) throw new Error("biliclient not ready");
        const result = await bili.loginQR();
        setQrValue(result.url);
        setShowQr(true);
        setShowLoading(false);

        const interval = setInterval(async () => {
          try {
            const r = await bili.login(true, interval);
            if (r.success) {
              prompt.showToast({ message: "登录成功" });
              clearInterval(interval);
              pollRef.current = null;
              router.replace({ uri: "pages/app/entry/introduction" });
            } else if (r.message.includes("登录失败")) {
              prompt.showToast({ message: r.message, duration: 5000 });
            }
          } catch (e) {
            console.error("[login] poll err", e);
          }
        }, 1500);
        pollRef.current = interval;
      } catch (e) {
        console.error("[login] getQR err", e);
        prompt.showToast({ message: "无法获取QR码，请重试", duration: 3000 });
        setShowLoading(false);
      }
    })();

    return () => {
      clearInterval(animId);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  return (
    <View>
      <View
        className="flex-col items-center w-full h-full"
        style={{
          backgroundColor: "#000000",
          marginTop: `${Math.round(marginTop)}px`,
        }}
      >
        <Text
          className="text-white"
          style={{ fontWeight: "bold", marginTop: "35px", fontSize: "30px" }}
        >
          {t("login.scanToLogin")}
        </Text>

        <View
          className="flex items-center justify-center"
          style={{
            marginTop: "30px",
            width: "233px",
            height: "233px",
            borderRadius: "12px",
            backgroundColor: "white",
          }}
        >
          {showQr && (
            <Qr value={qrValue} style={{ width: "210px", height: "210px" } as any} />
          )}
          {showLoading && (
            <View style={{ position: "absolute" }}>
              <Loading />
            </View>
          )}
        </View>

        <Text
          className="text-white"
          style={{ marginTop: "20px", fontSize: "26px", fontWeight: "bold" }}
        >
          {t("login.goToOfficialApp")}
        </Text>
        <Text className="text-white" style={{ fontSize: "20px" }}>
          {t("login.doScan")}
        </Text>
      </View>
    </View>
  );
}

export const lifecycle = {
  onInit() {
    console.log("[login] onInit");
  },
};

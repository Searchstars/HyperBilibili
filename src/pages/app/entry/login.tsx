import { QR, Text, View, router, useEffect, useState } from "@astralsight/astroforge-core";
import PageShell from "../../../shared/ui/PageShell";
import Loading from "../../../shared/ui/Loading";
import { loginQR, pollQR, persistAccount, refreshAccountInfo } from "../../../shared/api/account";

// 二维码扫码登录。流程：
//   1) loginQR() 取二维码 url + key
//   2) 每 3 秒 pollQR() 一次；扫码完成后写入存储 -> 跳 prepage
//
// 旧版在轮询里发请求，没节流；新版用 useEffect 的 cleanup 销毁定时器，
// 防止离开页面后还在打风控接口。
export default function Login() {
  const [qrUrl, setQrUrl] = useState("");
  const [status, setStatus] = useState("正在生成二维码");

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    let stopped = false;

    (async () => {
      try {
        const { url } = await loginQR();
        if (stopped) return;
        setQrUrl(url);
        setStatus("请使用 B 站 App 扫码");

        timer = setInterval(async () => {
          const res = await pollQR();
          setStatus(res.message);
          if (!res.ok) return;
          if (timer) clearInterval(timer);
          await persistAccount();
          await refreshAccountInfo();
          router.replace({ uri: "pages/app/entry/prepage" });
        }, 3000);
      } catch {
        setStatus("二维码加载失败，请稍后重试");
      }
    })();

    return () => {
      stopped = true;
      if (timer) clearInterval(timer);
    };
  }, []);

  return (
    <PageShell>
      <View className="flex h-full w-full flex-col items-center justify-center">
        <Text className="mb-3 text-base text-white">扫码登录</Text>
        {qrUrl ? (
          <QR type="qrcode" value={qrUrl} className="h-44 w-44 bg-white" />
        ) : (
          <Loading text="生成中" />
        )}
        <Text className="mt-3 text-xs text-gray-400">{status}</Text>
      </View>
    </PageShell>
  );
}

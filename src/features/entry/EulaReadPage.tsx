import { router, Text, useEffect, useState, View } from "@astralsight/astroforge-core";
import { Button } from "@shared/ui/Button";
import { HtmlRenderer } from "@shared/ui/HtmlRenderer";
import { Loading } from "@shared/ui/Loading";
import { t } from "@shared/i18n";
import { saveSettings } from "@shared/settings";
import { state } from "@shared/state";
import { parseContentHtml, type HtmlDocument } from "@shared/utils/htmlparser";

/**
 * 协议页面 —— 对齐旧版 eularead.ux：
 *   - 顶部标题 + 副标题
 *   - 1500ms 预留 init 时间后展示协议内容（保留旧节奏感）
 *   - "同意并继续"写入 settings.agreedAllAgreements=true 后清栈跳回 splash
 *   - "退出"清栈 router.back()
 */
export default function EulaReadPage() {
  const [showContent, setShowContent] = useState(false);
  const [doms, setDoms] = useState<HtmlDocument[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const html = state.biliclient?.getEulaShowContent() ?? "";
        setDoms(parseContentHtml(html));
        setShowContent(true);
      } catch (e) {
        console.error("[eularead] parse failed", e);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleAgree = async () => {
    await saveSettings({ agreedAllAgreements: true });
    router.clear();
    router.replace({ uri: "pages/app/entry/splash" });
  };

  const handleExit = () => {
    router.clear();
    try {
      router.back();
    } catch {
      /* 顶层栈直接 back 可能失败，忽略 */
    }
  };

  return (
    <View
      className="flex-col items-center w-full h-full"
      style={{ backgroundColor: "#000000" }}
    >
      {!showContent && (
        <View style={{ position: "absolute", marginTop: "300px" }}>
          <Loading />
        </View>
      )}
      <Text
        className="text-white"
        style={{ fontWeight: "600", marginTop: "45px", fontSize: "40px" }}
      >
        {t("eularead.title")}
      </Text>
      <Text
        className="text-white"
        style={{ fontWeight: "600", marginTop: "15px", fontSize: "24px", width: "75%" }}
      >
        {t("eularead.sectitle")}
      </Text>
      {showContent && (
        <View
          className="flex-col items-center"
          style={{ marginTop: "20px", width: "75%" }}
        >
          <HtmlRenderer doms={doms} />
          <Button text="同意并继续" primary marginTop="25px" onClick={handleAgree} />
          <Button text="退出" marginTop="15px" onClick={handleExit} />
        </View>
      )}
      <Text style={{ marginTop: "25px" }} />
    </View>
  );
}

export const lifecycle = {
  onInit() {
    console.log("[eularead] onInit");
  },
};

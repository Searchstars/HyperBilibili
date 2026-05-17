import { router, Text, View } from "@astralsight/astroforge-core";
import { Button } from "@shared/ui/Button";
import { t } from "@shared/i18n";
import { app } from "@astralsight/astroforge-core";

export default function NetworkErrorPage() {
  const onRetry = () => {
    router.clear();
    router.replace({ uri: "pages/app/entry/splash" });
  };
  const onDownloads = () => {
    router.replace({ uri: "pages/app/features/savedcontent" });
  };
  const onExit = () => {
    try {
      app.terminate();
    } catch (e) {
      console.warn("[networkerror] terminate failed", e);
    }
  };

  return (
    <View
      className="flex-col items-center w-full h-full"
      style={{ backgroundColor: "#000000" }}
    >
      <Text
        className="text-white"
        style={{ marginTop: "60px", fontSize: "28px", fontWeight: "600", width: "85%", textAlign: "center" }}
      >
        {t("networkerror.title")}
      </Text>
      <Text
        className="text-white"
        style={{ marginTop: "10px", fontSize: "20px", width: "85%", textAlign: "center" }}
      >
        {t("networkerror.sectitle")}
      </Text>
      <Button text="networkerror.retry" primary marginTop="25px" onClick={onRetry} />
      <Button text="networkerror.downloads" marginTop="15px" onClick={onDownloads} />
      <Button text="networkerror.exit" marginTop="15px" onClick={onExit} />
    </View>
  );
}

export const lifecycle = {
  onInit() {
    console.log("[networkerror] onInit");
  },
};

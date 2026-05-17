import { Scroll, Text, View, router } from "@astralsight/astroforge-core";
import PageShell from "../../../shared/ui/PageShell";
import HtmlRenderer from "../../../shared/ui/HtmlRenderer";
import Button from "../../../shared/ui/Button";
import { eulaHtml } from "../../../shared/util/eula";
import { updateSettings } from "../../../shared/util/settings";

// 用户协议与隐私政策合并页。同意 = 写入 agreedAllAgreements=true + 跳引导。
export default function EulaRead() {
  const onAgree = async () => {
    await updateSettings({ agreedAllAgreements: true });
    router.replace({ uri: "pages/app/entry/introduction" });
  };

  return (
    <PageShell>
      <Text className="mt-3 text-center text-base text-white">用户协议</Text>
      <Scroll className="mx-3 mt-2 flex-1 bg-gray-900 px-2 py-2" scrollY={true}>
        <HtmlRenderer html={eulaHtml} className="text-xs text-gray-200" />
      </Scroll>
      <View className="my-3 flex w-full flex-row items-center justify-center">
        <Button label="同意并继续" onClick={onAgree} />
      </View>
    </PageShell>
  );
}

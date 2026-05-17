import { Image, router, Text, View } from "@astralsight/astroforge-core";
import { useDeviceInfo } from "../hooks/useDeviceInfo";
import { t } from "../i18n";
import { TimeView } from "./TimeView";

export interface TitleBarProps {
  /** i18n 键，例如 "arealist.title"。也可以直接传纯文字（找不到 key 时回落显示）。 */
  title: string;
  /** 是否显示返回按钮。默认 true。 */
  showBack?: boolean;
  /** 点击返回时的回调。返回 false 表示阻止默认 router.back()。 */
  onBack?: () => boolean | void;
}

export function TitleBar({ title, showBack = true, onBack }: TitleBarProps) {
  const device = useDeviceInfo();
  const isRect = device?.screenShape === "rect";

  const handleBack = () => {
    const r = onBack?.();
    if (r === false) return;
    try {
      router.back();
    } catch (e) {
      console.warn("[TitleBar] router.back failed", e);
    }
  };

  const titleText = t(title);

  if (isRect) {
    return (
      <View className="flex-col items-center justify-center">
        <View
          className="flex-row items-center justify-start"
          style={{
            width: `${device?.screenWidth ?? 480}px`,
            marginTop: "10px",
            marginLeft: "100px",
            paddingBottom: "10px",
          }}
          onClick={showBack ? handleBack : undefined}
        >
          {showBack && (
            <Image
              src="/common/icons8-back-100.png"
              style={{ width: "30px", height: "30px", marginRight: "5px" }}
            />
          )}
          <Text className="text-[32px] text-white">{titleText}</Text>
          <TimeView />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-col items-center justify-center">
      <TimeView />
      <View
        className="flex-row items-center justify-center"
        style={{ marginTop: "45px", paddingBottom: "10px" }}
        onClick={showBack ? handleBack : undefined}
      >
        {showBack && (
          <Image
            src="/common/icons8-back-100.png"
            style={{ width: "30px", height: "30px", marginRight: "5px" }}
          />
        )}
        <Text
          className="text-[32px] text-white"
          style={{ marginTop: "3px" }}
        >
          {titleText}
        </Text>
      </View>
    </View>
  );
}

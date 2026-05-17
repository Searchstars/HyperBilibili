import { Image, router, Text, useEffect, useState, View } from "@astralsight/astroforge-core";
import { ScrollList } from "@shared/ui/ScrollList";
import { TitleBar } from "@shared/ui/TitleBar";
import { t } from "@shared/i18n";

type AreaKey = "main" | "dynamic" | "mypage" | "settings" | "savedcontent";

/**
 * Arealist 菜单页 —— 对齐旧版 arealist.ux：
 *   - 标题 + 4 个圆形大按钮（首页 / 动态 / 我的 / 设置）
 *   - 1 个小胶囊按钮（缓存 savedcontent）
 *   - 滚到底部：插入 FX 图 + 700ms 后 router.replace 到 search
 *   - 根据 lastpage 把对应按钮的底色高亮成粉色（#FF7DA8）
 *
 * lastpage 在旧版是页面 prop（router.push 时传），新版从 router state
 * 拿不到 prop 时直接读 query 或忽略——这里通过 lifecycle 注入。
 */
function makeColors(lastpage: string): Record<AreaKey, string> {
  const base = {
    main: "#222222",
    dynamic: "#222222",
    mypage: "#222222",
    settings: "#222222",
    savedcontent: "#222222",
  } as Record<AreaKey, string>;
  if (lastpage && lastpage in base) base[lastpage as AreaKey] = "#FF7DA8";
  return base;
}

export default function ArealistPage(props: { lastpage?: string }) {
  const lastpage = props.lastpage ?? "";
  const [colors] = useState(() => makeColors(lastpage));
  const [showFx, setShowFx] = useState(false);
  const [fxBottom, setFxBottom] = useState(-350);

  const goPage = (segment: string) => {
    try {
      router.clear();
      router.replace({ uri: `pages/${segment}` });
    } catch (e) {
      console.error("[arealist] goPage err", e);
    }
  };

  const onScrollBottom = () => {
    if (showFx) return;
    setShowFx(true);
    // 模拟旧版 DomAnim：bottom -350 → 450, 600ms
    const start = Date.now();
    const dur = 600;
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      if (elapsed >= dur) {
        setFxBottom(450);
        clearInterval(id);
        setTimeout(() => router.replace({ uri: "pages/search/search" }), 100);
      } else {
        setFxBottom(-350 + (450 - -350) * (elapsed / dur));
      }
    }, 16);
  };

  useEffect(() => {
    console.log("[arealist] lastpage=", lastpage);
  }, [lastpage]);

  return (
    <View
      className="flex-col items-center w-full h-full"
      style={{ backgroundColor: "#000000" }}
    >
      <ScrollList onScrollBottom={onScrollBottom}>
        <TitleBar title="arealist.title" showBack={false} />

        {/* Row 1: main + dynamic */}
        <View
          className="flex-row"
          style={{ width: "300px", marginTop: "15px" }}
        >
          <View
            className="flex-col items-center justify-center"
            onClick={() => goPage("app/features/main")}
          >
            <View
              className="flex items-center justify-center"
              style={{
                width: "130px",
                height: "130px",
                borderRadius: "65px",
                backgroundColor: colors.main,
              }}
            >
              <Image
                src="/common/arealist_home.png"
                style={{ width: "70px", height: "76px", objectFit: "scale-down" }}
              />
            </View>
            <Text
              className="text-white"
              style={{ fontSize: "30px", fontWeight: "600", marginTop: "5px" }}
            >
              {t("arealist.home")}
            </Text>
          </View>

          <View
            className="flex-col items-center justify-center"
            style={{ marginLeft: "35px" }}
            onClick={() => goPage("app/features/dynamic")}
          >
            <View
              className="flex items-center justify-center"
              style={{
                width: "130px",
                height: "130px",
                borderRadius: "65px",
                backgroundColor: colors.dynamic,
              }}
            >
              <Image
                src="/common/arealist_updates.png"
                style={{ width: "70px", height: "76px", objectFit: "scale-down" }}
              />
            </View>
            <Text
              className="text-white"
              style={{ fontSize: "30px", fontWeight: "600", marginTop: "5px" }}
            >
              {t("arealist.dynamic")}
            </Text>
          </View>
        </View>

        {/* Row 2: my + settings */}
        <View
          className="flex-row"
          style={{ width: "300px", marginTop: "15px" }}
        >
          <View
            className="flex-col items-center justify-center"
            onClick={() => goPage("app/features/mypage")}
          >
            <View
              className="flex items-center justify-center"
              style={{
                width: "130px",
                height: "130px",
                borderRadius: "65px",
                backgroundColor: colors.mypage,
              }}
            >
              <Image
                src="/common/arealist_my.png"
                style={{ width: "70px", height: "76px", objectFit: "scale-down" }}
              />
            </View>
            <Text
              className="text-white"
              style={{ fontSize: "30px", fontWeight: "600", marginTop: "5px" }}
            >
              {t("arealist.my")}
            </Text>
          </View>

          <View
            className="flex-col items-center justify-center"
            style={{ marginLeft: "35px" }}
            onClick={() => goPage("app/features/settings")}
          >
            <View
              className="flex items-center justify-center"
              style={{
                width: "130px",
                height: "130px",
                borderRadius: "65px",
                backgroundColor: colors.settings,
              }}
            >
              <Image
                src="/common/arealist_settings.png"
                style={{ width: "70px", height: "76px", objectFit: "scale-down" }}
              />
            </View>
            <Text
              className="text-white"
              style={{ fontSize: "30px", fontWeight: "600", marginTop: "5px" }}
            >
              {t("arealist.settings")}
            </Text>
          </View>
        </View>

        {/* Row 3: savedcontent small button */}
        <View
          className="flex-row items-center justify-center"
          style={{ width: "300px", marginTop: "30px" }}
        >
          <View
            className="flex-row items-center justify-center"
            style={{
              width: "140px",
              height: "55px",
              borderRadius: "32px",
              backgroundColor: colors.savedcontent,
            }}
            onClick={() => goPage("app/features/savedcontent")}
          >
            <Image src="/common/arealist_savedcontent.png" />
            <Text
              className="text-white"
              style={{ fontSize: "25px", fontWeight: "600", marginLeft: "11px" }}
            >
              {t("arealist.downloads")}
            </Text>
          </View>
        </View>

        <Text
          className="text-white"
          style={{ fontSize: "24px", fontWeight: "600", marginTop: "50px" }}
        >
          {t("arealist.scrollToSearch")}
        </Text>
        <View style={{ marginTop: "450px" }} />
      </ScrollList>

      {showFx && (
        <Image
          src="/common/TranslateFX/searchEnterFX.png"
          style={{
            position: "absolute",
            bottom: `${Math.round(fxBottom)}px`,
          }}
        />
      )}
    </View>
  );
}

export const lifecycle = {
  onInit() {
    console.log("[arealist] onInit");
  },
};

import { Text, View, router, useEffect, useState } from "@astralsight/astroforge-core";
import PageShell from "../../../../shared/ui/PageShell";
import TitleBar from "../../../../shared/ui/TitleBar";
import SettingItem from "../../../../shared/ui/SettingItem";
import { getSettings, updateSettings } from "../../../../shared/util/settings";
import { logout } from "../../../../shared/api/account";

// 设置首页。把可调字段以静态列表呈现，二级页面（如启动页选择）通过 router 进入。
export default function SettingsPage() {
  // useState 初值必须是静态字面量；真实设置由 useEffect 在 onReady 里塞入。
  const [settings, setSettings] = useState<ReturnType<typeof getSettings>>({
    freshType: 3,
    homeVidCount: 10,
    articleSplitDomCount: 9999,
    enableFullAnimation: false,
    startupPage: "主页",
    agreedAllAgreements: false,
    enableUserTracker: true,
    pinnedDMUsers: [],
  });

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const cycleFresh = async () => {
    const next = ((settings.freshType % 3) + 1) as 1 | 2 | 3;
    const updated = await updateSettings({ freshType: next });
    setSettings(updated);
  };

  const toggleAnim = async () => {
    const updated = await updateSettings({ enableFullAnimation: !settings.enableFullAnimation });
    setSettings(updated);
  };

  const doLogout = async () => {
    await logout();
    router.clear();
    router.replace({ uri: "pages/app/entry/login" });
  };

  return (
    <PageShell>
      <TitleBar title="设置" />
      <SettingItem icon="/common/settings_freshtype.png" label="推荐相关度" value={String(settings.freshType)} onClick={cycleFresh} />
      <SettingItem icon="/common/settings_homevidcount.png" label="首页每页条数" value={String(settings.homeVidCount)} />
      <SettingItem icon="/common/settings_enablefullanim.png" label="启用入场动画" value={settings.enableFullAnimation ? "开" : "关"} onClick={toggleAnim} />
      <SettingItem icon="/common/settings_startuppage.png" label="启动页" value={settings.startupPage} />
      <SettingItem icon="/common/settings_removetmp.png" label="清理缓存" onClick={() => router.push({ uri: "pages/app/features/settings/cleartmp" })} />
      <SettingItem icon="/common/settings_about.png" label="关于" onClick={() => router.push({ uri: "pages/app/features/settings/about" })} />
      <SettingItem icon="/common/donation.png" label="支持开发者" onClick={() => router.push({ uri: "pages/app/features/settings/donation" })} />
      <SettingItem icon="/common/aboutpage_code.png" label="开源软件许可" onClick={() => router.push({ uri: "pages/app/features/settings/opensoftware" })} />
      <SettingItem icon="/common/settings_logout.png" label="退出登录" onClick={doLogout} />
    </PageShell>
  );
}

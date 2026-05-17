import type { AstroForgePluginOptions } from "@astralsight/astroforge-rsbuild-plugin";

// AstroForge rsbuild plugin 自动扫描 src/pages/**/*.tsx 生成路由表，
// 路由 = 相对 src 的路径去掉 `.tsx`。所以 src/pages/app/entry/splash.tsx
// → 路由 `pages/app/entry/splash`，与旧版 manifest 100% 对齐。
//
// 当前 plugin 只支持字面量字段（不能用 const / process.env 三元）。
// dev / release 包名 + icon 通过 scripts/swap-manifest.mjs 在构建前对下面
// `package: ...` / `icon: ...` 两行字面量做替换；请勿手改。

export default {
  manifest: {
    // HB_MANIFEST_PACKAGE
    package: "com.searchstars.hyperbilibili.dev",
    name: "澎湃哔哩",
    versionName: "2.5.0",
    versionCode: 2,
    minPlatformVersion: 1000,
    // HB_MANIFEST_ICON
    icon: "/common/logoDEV.png",
    deviceTypeList: ["watch"],
    features: [
      { name: "system.router" },
      { name: "system.request" },
      { name: "system.audio" },
      { name: "system.file" },
      { name: "system.vibrator" },
      { name: "system.prompt" },
      { name: "system.device" },
      { name: "system.fetch" },
      { name: "system.storage" },
      { name: "system.crypto" },
      { name: "system.folme" },
      { name: "system.interconnect" },
      { name: "system.network" },
    ],
    config: {
      logLevel: "log",
      designWidth: "device-width",
      background: {
        features: ["system.request", "system.audio"],
      },
    },
    display: {
      backgroundColor: "#000000",
    },
    router: {
      entry: "pages/app/entry/splash",
    },
  },
  plugin: {
    target: "vela",
  } satisfies AstroForgePluginOptions,
};

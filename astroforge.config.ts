// 项目 manifest 配置（dev 包名）。
//
// 限制：astroforge-rsbuild-plugin 的配置解析器只接受纯可序列化字面量
// （StringLiteral / NumericLiteral / Array / Object 等），不接受 ternary、
// MemberExpression、import 引用。因此：
//   - versionName / versionCode 在此手动维护，与 package.json 同步
//   - dev / release 双包名通过 astroforge.release.config.ts + CLI --config
//     文件级切换，而不是运行时分支
//
// 路由表与 src/pages 文件系统一一对应，rsbuild-plugin 自动派生；只显式声明
// entry 避免字母序最前的页面误成首屏。

export default {
  manifest: {
    package: "com.searchstars.hyperbilibili.dev",
    name: "澎湃哔哩",
    versionName: "2.5.0",
    versionCode: 20500,
    minPlatformVersion: 1000,
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
  },
};

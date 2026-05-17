// release 版本的 manifest。
//
// 与 astroforge.config.ts 唯一区别：package + icon 翻到正式版命名。
// 由于 astroforge-rsbuild-plugin 的配置解析器只支持纯字面量，无法用 ternary
// 或环境变量翻转字段，所以通过文件级双份配置。CI 在 release 步骤通过
// `--config-file astroforge.release.config.ts` 选择。

export default {
  manifest: {
    package: "com.searchstars.hyperbilibili",
    name: "澎湃哔哩",
    versionName: "2.5.0",
    versionCode: 20500,
    minPlatformVersion: 1000,
    icon: "/common/logo.png",
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
      entry: "pages/app/arealist",
    },
  },
  plugin: {
    target: "vela",
  },
};

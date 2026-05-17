import type { AstroForgePluginOptions } from "@astralsight/astroforge-rsbuild-plugin";

// AstroForge 项目配置。
//
// - manifest：完整保留到 Vela `manifest.json`。IR 未显式建模的字段（如
//   `subpackages`、`widgets`、`router.params`）也会按源序透传。
// - plugin.target：当前仅支持 `"vela"`。
export default {
  manifest: {
    package: "com.example.astroforgeapp",
    name: "astroforge-app",
    versionName: "1.0.0",
    versionCode: 1,
    minPlatformVersion: 1200,
    icon: "/common/logo.png",
    deviceTypeList: ["watch"],
    features: [{name: "system.router"}],
    config: {
      logLevel: "log",
      designWidth: "device-width",
    },
  },
  plugin: {
    target: "vela",
  } satisfies AstroForgePluginOptions,
};

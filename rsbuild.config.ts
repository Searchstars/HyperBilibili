import { defineConfig } from "@rsbuild/core";
import { pluginAstroForge } from "@astralsight/astroforge-rsbuild-plugin";

// Rsbuild 仅负责 TSX 编译与 IR 生成；最终 Vela JS / rpk 由 Rust 后端在
// `astroforge build` 阶段完成。
export default defineConfig({
  plugins: [pluginAstroForge()],
});

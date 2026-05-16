# AstroForge 应用

由 `astroforge init` 生成的 Vela 智能手表快应用模板。

## 目录结构

```
src/
├─ app.tsx                # 应用级生命周期
├─ common/                # 资源（图标、字体等），相对路径以 / 开头时被打入包内
└─ pages/<name>/<name>.tsx  # 页面，按文件路径自动发现并注册到 router
astroforge.config.ts       # manifest 与 plugin 配置
rsbuild.config.ts          # Rsbuild 入口；自动加载 @astralsight/astroforge-rsbuild-plugin
tsconfig.json              # 启用 JSX automatic runtime + @astralsight/astroforge-core
```

## 常用命令

```bash
pnpm install                                  # 安装依赖
pnpm exec astroforge build --target vela      # 产出 debug rpk → dist/<package>.debug.rpk
pnpm exec astroforge release --target vela    # 产出 release rpk（需要 sign/release/*.pem）
pnpm exec astroforge dev                      # 监听源码变更，增量重建 rpk
pnpm exec astroforge inspect rpk <path>       # 查看 rpk 文件结构与签名状态
```

## 签名

debug 模式按以下顺序查找签名材料：

1. 环境变量 `ASTROFORGE_VELA_PRIVATE_KEY` / `..._CERTIFICATE`；
2. `sign/debug/{private,certificate}.pem`；
3. `sign/{private,certificate}.pem`；
4. AstroForge 内置 debug 证书（仅 debug，不可签 release）。

release 模式只查找环境变量、`sign/release/`、`sign/`；都没有则直接报错。

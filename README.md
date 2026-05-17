# 澎湃哔哩 (HyperBilibili)

第三方哔哩哔哩客户端，跑在 Xiaomi Vela OS 设备上（Watch S3 / S4 / RW5 等）。
基于 [AstroForge](https://github.com/AstralSightStudios/AstroForge) 工具链，
源码语言 React/TSX，编译产物字节兼容 Vela rpk。

## 目录约定

```
src/
  app.tsx                    全局生命周期
  pages/                     按文件系统派生路由（pages/<path>/<name>.tsx → pages/<path>/<name>）
  shared/
    api/                     B 站接口（http / wbi / cache / 各业务模块）
    ui/                      组件库（PageShell / TitleBar / OnlineImage / VideoCard ...）
    util/                    日志、设置、文件、设备等纯工具
  common/                    图片与 GIF 资源
  i18n/                      中英文资源
  .buildinfo.json            构建时由 scripts/gen-buildinfo.mjs 生成
scripts/
  gen-buildinfo.mjs          注入版本号 / commit
  generate-vela-tailwind.mjs Tailwind → Vela 兼容 CSS
  build-gifs.mjs             旧序列帧 → 单帧 GIF
```

## 构建

```bash
pnpm i
pnpm build:gifs             # 一次性把 src/common/seqanims/* 合成 .gif
pnpm dev                    # 开发热重载
pnpm build                  # 构建 debug rpk（包名 .dev）
HB_RELEASE=1 pnpm release   # 构建 release rpk
```

`astroforge inspect rpk dist/*.rpk` 可查看产物结构。

## 与旧版差异

* 删除 `src/animation` 自研序列帧引擎；新设备已支持 GIF，统一交给宿主渲染。
* 删除听视频 / player 功能。
* 统一到 `vela-tailwind`；不再使用 LESS。
* 全部模块从 class + prototype 合并改为函数式模块。
* `global.xxx` 全部移除；状态由对应模块自管单例。

## 签名

debug 模式按以下顺序查找签名材料：

1. 环境变量 `ASTROFORGE_VELA_PRIVATE_KEY` / `..._CERTIFICATE`
2. `sign/debug/{private,certificate}.pem`
3. `sign/{private,certificate}.pem`
4. AstroForge 内置 debug 证书

release 模式只查找环境变量、`sign/release/`、`sign/`；都没有则直接报错。

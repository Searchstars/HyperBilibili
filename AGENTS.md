# AGENTS.md

## Project Overview

Third-party Bilibili client for Xiaomi Vela embedded watches, built with the **QuickApp** framework (快应用). Targets round watches (S3/S4 at 466px, RW5 at 432px design width).

## Key Commands

```bash
yarn                          # install deps (NEVER use npm — postinstall enforces this)
yarn start                    # dev server with watch + NuttX device
yarn build                    # production build (outputs dist/*.rpk)
yarn lint                     # eslint --fix on src/**/*.{ux,js}
python scripts/build_s3s4.py  # build for S3/S4 watches (466px design width)
python scripts/build_rw5.py   # build for RW5 watches (432px design width)
```

Build scripts mutate `src/manifest.json` `config.designWidth` before calling `yarn build`. The CI runs both sequentially.

## Architecture

**Framework**: QuickApp (小米快应用) — NOT Vue, React, or standard web. Uses `.ux` single-file components with `<template>`, `<script>`, `<style>` blocks. Docs: https://iot.mi.com/vela/quickapp

**Build toolchain**: `aiot-toolkit` (rspack-based). TypeScript compiled via `builtin:swc-loader`, NOT tsc. The `tsconfig.json` exists for editor support only.

**Entry point**: `src/manifest.json` → router entry is `pages/app/entry/splash`

**Generated file**: `src/buildinfo.ts` is auto-generated at build time (gitignored). Do not create or edit it manually. Import it as `$buildinfo`.

**System API bridge**: `src/tsimports.js` re-exports QuickApp system APIs (`@system.fetch`, `@system.storage`, etc.) for use in TypeScript files. Import from `'../tsimports'`, not directly from `@system.*`.

**Path aliases** (defined in `quickapp.config.js`):
- `@src` → `src/`
- `@components` → `src/components/`
- `@less` → `src/less/`
- `@protobuf` → `src/protobuf/`
- `$buildinfo` → `src/buildinfo.ts`

**BilibiliClient**: API client assembled via `Object.assign` onto a single prototype from modules in `src/bilibiliclient/`. Each subdirectory (video, search, comment, etc.) exports a methods object merged in `client.ts`.

**Global state**: App-level singletons are attached to `global` in `src/app.ux` — `global.biliclient`, `global.logger`, `global.settings`, `global.ui`, `global.animengine`, `global.bgimg`, `global.savedcontent`. Access these from any page/component.

## File Conventions

- **`.ux` files**: QuickApp components. Use `<import>` to register child components (not ES modules). Template syntax is Vue-like but has differences (e.g., `if`/`for` directives, `@click`).
- **`.ts` files**: Business logic, API clients, utilities. Standard TypeScript.
- **`.less` files**: Styles, scoped per component. Stylelint uses `postcss-less` custom syntax.
- **`src/less/`**: Shared style variables/mixins.
- **`src/common/`**: Shared static assets (images, icons).

## Style & Lint

- **Prettier**: no semicolons, double quotes, no trailing commas, 100 char width, no bracket spacing. `.ux` files parsed as Vue.
- **ESLint**: extends prettier config. Lints `.ux` and `.js` in `src/`.
- **Stylelint**: standard + recess property order. Ignores `.js` files. Allows QuickApp-specific properties (`placeholder-color`, `gradient-*`, `caret-color`, etc.).
- **lint-staged**: runs on commit via husky — prettier + eslint for `*.{ux,js}`, prettier + stylelint for `*.{less,css}`.
- **Commitlint**: conventional commits. Allowed types: `bug`, `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `revert`, `merge`.

## Gotchas

- **No test suite exists.** There are no unit tests or integration tests. Verify changes manually on device or emulator.
- **`src/manifest.json` is mutable at build time.** Build scripts overwrite `config.designWidth`. Don't assume its value is stable.
- **QuickApp is not web.** DOM APIs, `window`, `document` do not exist. The runtime is a V8/JSC engine on embedded Linux. Use `system.*` APIs for device capabilities.
- **`.ux` template syntax diverges from Vue.** For example, `static` attribute on elements marks them as non-reactive for perf. `@system.folme` provides animation, not CSS transitions.
- **i18n**: strings in `src/i18n/{en,zh}.json`. Components reference keys like `"main.title"`.
- **CI**: GitHub Actions builds on push/PR to `next-gen` branch only. Produces two RPK artifacts (S3/S4 and RW5).
- **No `dist/` or `build/` in repo.** Both are gitignored. RPK output goes to `dist/`.

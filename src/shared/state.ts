// 全局单例状态。
//
// AstroForge 0.0.11 不提供 useContext / Provider；用模块级 singleton 替代旧版的
// `global.biliclient` / `global.settings` / `global.DEVICE_INFO`。
//
// 页面读写时直接 `import { state } from '@shared/state'`，相比 React Context
// 缺少响应式订阅 —— 但旧版本来也是同样的模式（全局可变对象 + 主动 setData），
// 所以这里不引入额外抽象，保持行为对齐。

import type { BilibiliClient } from "./api/client";
import type { SettingsInterface } from "./settings";

export interface AppState {
  biliclient: BilibiliClient | null;
  device: {
    info: Record<string, unknown> | null;
    serial: string | null;
    networkType: string | null;
  };
  settings: SettingsInterface | null;
  ready: boolean;
}

export const state: AppState = {
  biliclient: null,
  device: { info: null, serial: null, networkType: null },
  settings: null,
  ready: false,
};

export function getBili(): BilibiliClient {
  if (!state.biliclient) {
    throw new Error("biliclient not initialized; ensure app.tsx onCreate ran");
  }
  return state.biliclient;
}

import { ensureLogin } from "./account";
import { refreshBuvid } from "./account";
import { logger } from "../util/logger";

// 单例入口。app.onCreate 调用 initBilibili() 一次；之后业务页面直接 import
// 具体模块 (./video, ./folder, ...) 即可，不再需要拿 client 实例。

let bootstrapped = false;

export function initBilibili() {
  if (bootstrapped) return;
  bootstrapped = true;

  // 启动时只刷新一次 buvid，登录态由 ensureLogin 在入口页惰性触发。
  refreshBuvid().catch((err) => logger.warn("[client] init buvid failed", err));
}

export { ensureLogin };

import { BilibiliClient } from "./shared/api/client";
import { initI18n } from "./shared/i18n";
import { loadSettings } from "./shared/settings";
import { state } from "./shared/state";
import { getDeviceInformation, getDeviceSerial, getNetworkType } from "./shared/utils/tools";

// 注意：AstroForge plugin 把 onCreate 解析成普通函数，不保留 async 关键字，
// 所以这里不能用 await，只能用 promise.then 链式调用。

export default {
  onCreate() {
    console.log("[app] onCreate");
    initI18n();

    loadSettings().then((s) => {
      state.settings = s;
      console.log("[app] settings loaded");
    });

    getDeviceInformation()
      .then((info) => {
        state.device.info = info;
      })
      .catch((e) => console.warn("[app] getDeviceInformation failed", e));

    getDeviceSerial()
      .then((serial) => {
        state.device.serial = serial;
      })
      .catch((e) => console.warn("[app] getDeviceSerial failed", e));

    getNetworkType()
      .then((nt) => {
        state.device.networkType = nt;
      })
      .catch((e) => console.warn("[app] getNetworkType failed", e));

    const client = new BilibiliClient();
    state.biliclient = client;
    client.updateBUVID().catch((e) => console.warn("[app] updateBUVID failed", e));

    state.ready = true;
    console.log("[app] ready (init promises still resolving)");
  },
  onDestroy() {
    console.log("[app] onDestroy");
  },
};

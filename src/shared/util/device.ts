import { device, network, router } from "@astralsight/astroforge-core";
import { logger } from "./logger";

// 设备信息单例。旧版在 onCreate 里塞进 global.DEVICE_INFO；新版改为闭包内
// 持有，并暴露 getter，避免顶层 import 时序依赖。

let deviceInfo: Record<string, unknown> | undefined;
let deviceSerial: string | undefined;
let networkType: string | undefined;

export async function initDeviceInfo() {
  try {
    deviceInfo = await getDeviceInfo();
  } catch (err) {
    logger.error("[device] getInfo failed", err);
  }

  try {
    deviceSerial = await getDeviceSerial();
  } catch {
    // serial 拿不到说明无设备唯一标识权限；旧版会跳错误页，这里保留同样行为。
    router.clear();
    router.replace({ uri: "pages/error/permissionerror" });
    return;
  }

  try {
    networkType = await getNetworkType();
  } catch (err) {
    logger.error("[device] network.getType failed", err);
  }
}

export function getCachedDeviceInfo() {
  return deviceInfo;
}

export function getCachedDeviceSerial() {
  return deviceSerial;
}

export function getCachedNetworkType() {
  return networkType;
}

async function getDeviceInfo(): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    (device as any).getInfo({
      success: (data: Record<string, unknown>) => resolve(data),
      fail: (msg: string, code: number) => reject(new Error(`getInfo ${code}: ${msg}`)),
    });
  });
}

async function getDeviceSerial(): Promise<string> {
  return new Promise((resolve, reject) => {
    (device as any).getSerial({
      success: (data: { serial: string }) => resolve(data.serial),
      fail: (msg: string, code: number) => reject(new Error(`getSerial ${code}: ${msg}`)),
    });
  });
}

async function getNetworkType(): Promise<string> {
  return new Promise((resolve, reject) => {
    (network as any).getType({
      success: (data: { type: string }) => resolve(data.type),
      fail: (msg: string, code: number) => reject(new Error(`getType ${code}: ${msg}`)),
    });
  });
}

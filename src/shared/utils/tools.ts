import { device, network, router } from "@astralsight/astroforge-core";

export function formatNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 10000) return (num / 1000).toFixed(1) + "k";
  return (num / 10000).toFixed(1) + "w";
}

export function getCurrentTime(): string {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  return `${h < 10 ? "0" + h : h}:${m < 10 ? "0" + m : m}`;
}

export function getDeviceInformation(): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    device.getInfo({
      success: (data) => resolve(data as Record<string, unknown>),
      fail: (error) => reject(error),
    });
  });
}

export function getDeviceSerial(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      device.getSerial({
        success: (data: any) => resolve((data && data.serial) ?? ""),
        fail: (error) => {
          router.clear();
          router.replace({ uri: "pages/error/permissionerror" });
          reject(error);
        },
      });
    } catch (e) {
      // 一些机型上 getSerial 在调用时就抛同步异常
      router.clear();
      router.replace({ uri: "pages/error/permissionerror" });
      reject(e);
    }
  });
}

export function getNetworkType(): Promise<string> {
  return new Promise((resolve, reject) => {
    network.getType({
      success: (data: any) => resolve(data.type as string),
      fail: (error) => reject(error),
    });
  });
}

export function unicodeToString(unicodeStr: string): string {
  return unicodeStr.replace(/\\u([\dA-F]{4})/gi, (_, grp) =>
    String.fromCharCode(parseInt(grp, 16)),
  );
}

export async function networkCheck(): Promise<boolean> {
  try {
    const t = await getNetworkType();
    return !!t && t !== "none";
  } catch {
    return false;
  }
}

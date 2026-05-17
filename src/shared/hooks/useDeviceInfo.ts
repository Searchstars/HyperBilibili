import { useState, useEffect } from "@astralsight/astroforge-core";
import { state } from "../state";
import { getDeviceInformation } from "../utils/tools";

let cachedInfo: Record<string, unknown> | null = null;
let inflight: Promise<Record<string, unknown>> | null = null;

export interface DeviceInfo {
  screenWidth?: number;
  screenHeight?: number;
  windowWidth?: number;
  windowHeight?: number;
  screenShape?: "circle" | "pill-shaped" | "rect" | string;
  brand?: string;
  manufacturer?: string;
  model?: string;
  osType?: string;
  osVersionName?: string;
  [k: string]: unknown;
}

export function useDeviceInfo(): DeviceInfo | null {
  const initial = (cachedInfo ?? state.device.info) as DeviceInfo | null;
  const [info, setInfo] = useState<DeviceInfo | null>(initial);

  useEffect(() => {
    if (info) return;
    if (!inflight) {
      inflight = getDeviceInformation().then((v) => {
        cachedInfo = v;
        state.device.info = v;
        return v;
      });
    }
    inflight.then((v) => setInfo(v as DeviceInfo));
  }, [info]);

  return info;
}

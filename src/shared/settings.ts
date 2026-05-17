import { storage } from "@astralsight/astroforge-core";

export interface SettingsInterface {
  fresh_type: number;
  home_vid_count: number;
  article_split_dom_count: number;
  enableFullAnimation: boolean;
  startupPage: string;
  agreedAllAgreements: boolean;
  enableUserTracker: boolean;
  pinnedDMUsers: string[];
}

const DEFAULT_SETTINGS: SettingsInterface = {
  fresh_type: 3,
  home_vid_count: 10,
  article_split_dom_count: 9999,
  enableFullAnimation: false,
  startupPage: "主页",
  agreedAllAgreements: false,
  enableUserTracker: true,
  pinnedDMUsers: [],
};

export let SETTINGS: SettingsInterface = { ...DEFAULT_SETTINGS };

export function loadSettings(): Promise<SettingsInterface> {
  return new Promise((resolve) => {
    storage.get({
      key: "settings",
      success: (data: string) => {
        try {
          if (data) {
            const parsed = JSON.parse(data) as Partial<SettingsInterface>;
            SETTINGS = { ...DEFAULT_SETTINGS, ...parsed };
          }
        } catch (e) {
          console.warn("[settings] parse failed", e);
        }
        resolve(SETTINGS);
      },
      fail: (_: unknown, code: number) => {
        console.warn(`[settings] load failed code=${code}`);
        resolve(SETTINGS);
      },
    });
  });
}

export function saveSettings(params: Partial<SettingsInterface>): Promise<void> {
  SETTINGS = { ...SETTINGS, ...params };
  return new Promise((resolve) => {
    storage.set({
      key: "settings",
      value: JSON.stringify(SETTINGS),
      success: () => resolve(),
      fail: (_: unknown, code: number) => {
        console.warn(`[settings] save failed code=${code}`);
        resolve();
      },
    });
  });
}

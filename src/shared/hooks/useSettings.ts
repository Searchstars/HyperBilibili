import { useState, useCallback } from "@astralsight/astroforge-core";
import { SETTINGS, saveSettings, type SettingsInterface } from "../settings";

export function useSettings(): {
  settings: SettingsInterface;
  update: (patch: Partial<SettingsInterface>) => Promise<void>;
} {
  const [settings, setSettings] = useState<SettingsInterface>(SETTINGS);

  const update = useCallback(async (patch: Partial<SettingsInterface>) => {
    await saveSettings(patch);
    setSettings({ ...SETTINGS });
  }, []);

  return { settings, update };
}

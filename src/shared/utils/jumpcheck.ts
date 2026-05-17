import { router, storage } from "@astralsight/astroforge-core";

export function jumpAfterEula(): void {
  storage.get({
    key: "bilibili_account",
    success: (data: string) => {
      if (!data || data.length < 1) {
        router.replace({ uri: "pages/app/entry/login" });
      } else {
        router.replace({ uri: "pages/app/entry/prepage" });
      }
    },
    fail: () => {
      router.replace({ uri: "pages/app/entry/login" });
    },
  });
}

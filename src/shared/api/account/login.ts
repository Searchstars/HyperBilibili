import { router, storage } from "@astralsight/astroforge-core";
import type { AccountData } from "./accountData";

export const loginMethods = {
  async updateAccountInfo(this: any): Promise<boolean> {
    const accountInfoResponse = await this.getRequest(
      "https://api.bilibili.com/x/web-interface/nav",
    );

    if (!accountInfoResponse?.data?.data?.isLogin) {
      router.clear();
      router.replace({ uri: "pages/error/sessionood" });
    }

    this.accountInfo = accountInfoResponse?.data?.data;
    return !!this.accountInfo;
  },

  async updateBUVID(this: any): Promise<void> {
    const response = await this.getRequest(
      "https://api.bilibili.com/x/frontend/finger/spi",
    );
    this.buvid3 = response?.data?.data?.b_3 ?? null;
    this.buvid4 = response?.data?.data?.b_4 ?? null;
  },

  async loginQR(this: any): Promise<{ url: string; qrcode_key: string }> {
    console.log("[login] request QR");
    const response = await this.getRequest(
      "https://passport.bilibili.com/x/passport-login/web/qrcode/generate",
    );
    if (response?.data?.data) {
      this.qrCodeKey = response.data.data.qrcode_key;
      return {
        url: response.data.data.url,
        qrcode_key: response.data.data.qrcode_key,
      };
    }
    throw new Error("获取二维码失败");
  },

  async login(
    this: any,
    send_req: boolean,
    interval: ReturnType<typeof setInterval> | null = null,
  ): Promise<{ success: boolean; message: string }> {
    const accountData = await this.getStoredAccountData();
    if (accountData) {
      this.sessData = accountData.sessData;
      this.biliJct = accountData.biliJct;
      this.dedeUserID = accountData.dedeUserID;
      this.sid = accountData.sid;
      console.log("[login] stored account ok");
      await this.updateAccountInfo();
      await this.updateBUVID();
      return { success: true, message: "登录成功" };
    } else if (send_req) {
      const response = await this.getRequest(
        `https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key=${this.qrCodeKey}`,
      );
      if (response?.data?.data?.code === 0) {
        if (interval) clearInterval(interval);

        this.extractCookiesFromResponse(response.headers?.["Set-Cookie"]);
        await this.storeAccountData();
        await this.updateAccountInfo();
        await this.updateBUVID();
        return { success: true, message: "登录成功" };
      }
      return { success: false, message: "等待用户操作..." };
    }
    return { success: false, message: "未登录" };
  },

  extractCookiesFromResponse(this: any, setCookieHeaders: string | string[]) {
    if (!setCookieHeaders) return;
    let headers: string[];
    if (typeof setCookieHeaders === "string") {
      headers = setCookieHeaders.split(", ");
    } else {
      headers = setCookieHeaders;
    }
    headers.forEach((cookie) => {
      if (cookie.includes("SESSDATA")) this.sessData = this.parseCookie(cookie, "SESSDATA");
      else if (cookie.includes("bili_jct")) this.biliJct = this.parseCookie(cookie, "bili_jct");
      else if (cookie.includes("DedeUserID") && !cookie.includes("DedeUserID__ckMd5"))
        this.dedeUserID = this.parseCookie(cookie, "DedeUserID");
      else if (cookie.includes("sid")) this.sid = this.parseCookie(cookie, "sid");
    });
  },

  parseCookie(this: any, cookie: string, name: string): string | null {
    const match = cookie.match(new RegExp(`${name}=([^;]+)`));
    return match ? match[1] : null;
  },

  async getStoredAccountData(this: any): Promise<AccountData | null> {
    return new Promise((resolve) => {
      storage.get({
        key: "bilibili_account",
        success: (data: string) => {
          try {
            resolve(data ? (JSON.parse(data) as AccountData) : null);
          } catch {
            resolve(null);
          }
        },
        fail: (_: any, code: number) => {
          console.warn(`[login] storage.get failed code=${code}`);
          resolve(null);
        },
      });
    });
  },

  async storeAccountData(this: any): Promise<void> {
    if (this.sessData && this.biliJct && this.dedeUserID && this.sid) {
      const accountData: AccountData = {
        sessData: this.sessData,
        biliJct: this.biliJct,
        dedeUserID: this.dedeUserID,
        sid: this.sid,
      };
      return new Promise((resolve, reject) => {
        storage.set({
          key: "bilibili_account",
          value: JSON.stringify(accountData),
          success: () => resolve(),
          fail: (_: any, code: number) => {
            console.warn(`[login] storage.set failed code=${code}`);
            reject();
          },
        });
      });
    }
  },
};

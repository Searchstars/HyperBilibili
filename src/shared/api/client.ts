// BilibiliClient: 把旧版 prototype-mixin 的 BilibiliClient 改写为真正的 class，
// 方法分布到 sibling 文件并通过 method binding 装入 prototype。
//
// 行为契约严格对齐旧版：
//   - getRequest / postRequest / getRequestWbi / postRequestWbi 的入参/出参语义不变
//   - 所有业务方法签名、所返回字段路径与旧版一一对应（业务代码不需要改 .data.data.xxx）

import { storage } from "@astralsight/astroforge-core";
import {
  AccountInfo,
  BiliResponse,
  buildHeaders,
  encWbi,
  getEulaShowContent,
  rawGet,
  rawPost,
} from "./request";
import type { AccountData } from "./account/accountData";
import { videoMethods } from "./video/video";
import { videoActionMethods } from "./video/action";
import { loginMethods } from "./account/login";
import { articleMethods } from "./article/article";
import { favFolderMethods } from "./folder/favfolder";
import { historyMethods } from "./folder/history";
import { userMethods } from "./user/user";
import { commentMethods } from "./comment/comment";
import { messageMethods } from "./message/message";
import { searchMethods } from "./search/search";
import { dynamicMethods } from "./dynamic/dynamic";

import semver from "semver";

const dmDeviceId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
  /[xy]/g,
  (name) => {
    const r = (16 * Math.random()) | 0;
    return (name === "x" ? r : (3 & r) | 8).toString(16).toUpperCase();
  },
);

export class BilibiliClient {
  public version = "2.5";

  public sessData: string | null = null;
  public biliJct: string | null = null;
  public dedeUserID: string | null = null;
  public sid: string | null = null;
  public buvid3: string | null = null;
  public buvid4: string | null = null;

  public accountInfo: AccountInfo | null = null;
  public qrCodeKey: string | null = null;
  public readonly dm_deviceid = dmDeviceId;

  constructor() {
    // BUVID 由 app.tsx 主动 await 调用，构造函数保持同步无副作用。
  }

  getHeaders(): Record<string, string> {
    return buildHeaders({
      sessData: this.sessData,
      biliJct: this.biliJct,
      dedeUserID: this.dedeUserID,
      sid: this.sid,
      buvid3: this.buvid3,
      buvid4: this.buvid4,
    });
  }

  getCookieString(): string {
    // 与旧版保持一致：直接读上面 getHeaders 里的 Cookie 字段
    return this.getHeaders().Cookie;
  }

  // 旧版 GET 返回值即 fetch 的 response（body 在 response.data 内）
  async getRequest(url: string, responseType: string = "json"): Promise<BiliResponse> {
    console.log("[bili] GET", url);
    return rawGet(url, this.getHeaders(), responseType);
  }

  async postRequest(
    url: string,
    data: string,
    content_type: string,
    custom_headers: Record<string, string> | null = null,
  ): Promise<BiliResponse> {
    console.log("[bili] POST", url, "body:", data, "ct:", content_type);
    const headers = custom_headers ?? { ...this.getHeaders(), "Content-Type": content_type };
    return rawPost(url, data, headers);
  }

  encWbi(params: Record<string, any>, img_key: string, sub_key: string): string {
    return encWbi(params, img_key, sub_key);
  }

  async getRequestWbi(url: string, params: Record<string, any>): Promise<BiliResponse> {
    const img_key = this.accountInfo!.wbi_img!.img_url.split("/").pop()!.split(".")[0];
    const sub_key = this.accountInfo!.wbi_img!.sub_url.split("/").pop()!.split(".")[0];
    const signedParams = this.encWbi(params, img_key, sub_key);
    return this.getRequest(`${url}?${signedParams}`);
  }

  async postRequestWbi(
    url: string,
    wbiParams: Record<string, any>,
    data: string,
    content_type: string,
    custom_headers: Record<string, string> | null = null,
  ): Promise<BiliResponse> {
    const img_key = this.accountInfo!.wbi_img!.img_url.split("/").pop()!.split(".")[0];
    const sub_key = this.accountInfo!.wbi_img!.sub_url.split("/").pop()!.split(".")[0];
    const signedParams = this.encWbi(wbiParams, img_key, sub_key);
    return this.postRequest(`${url}?${signedParams}`, data, content_type, custom_headers);
  }

  async checkHyperbilibiliUpdates(): Promise<{ update: boolean; msg: string }> {
    const latestVerGet = await rawGet(
      "https://gitee.com/search__stars/hb_ota_info/raw/master/current_ver",
      this.getHeaders(),
    );
    const latestVer = (latestVerGet?.data as any)?.data;
    if (latestVer && semver.lt(this.version, latestVer)) {
      return {
        update: true,
        msg: `检查到更新v${latestVer}，请前往hyperbili.astralsight.space下载更新`,
      };
    }
    return { update: false, msg: "" };
  }

  getEulaShowContent(): string {
    return getEulaShowContent();
  }

  logOut() {
    storage.delete({ key: "bilibili_account" });
    this.sessData = null;
    this.biliJct = null;
    this.dedeUserID = null;
    this.sid = null;
    this.accountInfo = null;
  }

  // ===== 由子模块 mixin 进来的方法（在 prototype 上）=====
  declare updateAccountInfo: () => Promise<boolean>;
  declare updateBUVID: () => Promise<void>;
  declare loginQR: () => Promise<{ url: string; qrcode_key: string }>;
  declare login: (
    send_req: boolean,
    interval?: ReturnType<typeof setInterval> | null,
  ) => Promise<{ success: boolean; message: string }>;
  declare extractCookiesFromResponse: (headers: string | string[]) => void;
  declare parseCookie: (cookie: string, name: string) => string | null;
  declare getStoredAccountData: () => Promise<AccountData | null>;
  declare storeAccountData: () => Promise<void>;

  declare getMainPageRecommendVideos: (fresh_type: number, pagesize: number) => Promise<any>;
  declare getVideoInfoByBVID: (bvid: string) => Promise<any>;
  declare isVideoLikedByBVID: (bvid: string) => Promise<boolean>;
  declare isVideoCoinedByBVID: (bvid: string) => Promise<boolean>;
  declare isVideoStaredByBVID: (bvid: string) => Promise<boolean>;
  declare getVideoAISummaryByBVID: (bvid: string, cid: string, up_mid: string) => Promise<any>;
  declare getVideoMP4StreamByBVID: (cid: string, bvid: string, qn?: string) => Promise<any>;
  declare getVideoBestAudioUrlByBVID: (bvid: string) => Promise<string>;
  declare LikeVideo: (bvid: string, like: number) => Promise<any>;
  declare CoinVideo: (bvid: string, multiply: number) => Promise<any>;
  declare starVideoToDefaultFavFolderByBVID: (bvid: string) => Promise<any>;

  declare getArticle: (cvid: string, useNewOpusArticle?: boolean) => Promise<any>;
  declare getUserFavouriteFolders: (mid: string, type?: number, rid?: string | null) => Promise<any>;
  declare getFavouriteFolderMetadata: (mlid: string) => Promise<any>;
  declare getFavouriteFolderContent: (
    mlid: string,
    pn: number,
    ps?: number,
    keyword?: string | null,
  ) => Promise<any>;
  declare getWatchHistory: (pn: number, ps: number) => Promise<any>;

  declare getUserInfoByUID: (uid: string) => Promise<any>;
  declare getUserStatByUID: (uid: string) => Promise<any>;
  declare getUserMasterPieceByUID: (uid: string) => Promise<any>;
  declare getUserVideosByUID: (uid: string, pn: number, ps?: number) => Promise<any>;
  declare getUserDynamicListByUID: (uid: string) => Promise<any>;
  declare getUserNavnumByUID: (uid: string) => Promise<any>;
  declare getMultiUserInfoByUID: (uids: string[]) => Promise<any>;

  declare getReplies: (
    type: string,
    oid: string,
    pn?: number,
    ps?: number,
    sort?: number,
  ) => Promise<any>;
  declare getSecReplies: (
    type: string,
    oid: string,
    root: string,
    pn?: number,
    ps?: number,
  ) => Promise<any>;
  declare LikeReply: (type: string, oid: string, rpid: string, action: number) => Promise<any>;
  declare GiveReply: (type: string, oid: string, message: string) => Promise<any>;
  declare GiveSecReply: (type: string, oid: string, parent: string, message: string) => Promise<any>;
  declare GiveTreeReply: (
    type: string,
    oid: string,
    parent: string,
    root: string,
    message: string,
  ) => Promise<any>;

  declare getMessageNotifyFeed: () => Promise<any>;
  declare getDMSessions: (session_type: number, sort_rule: number) => Promise<any>;
  declare getDMSessionMessage: (
    session_type: number,
    talker_id: string,
    size: number,
    end_seqno: string,
  ) => Promise<any>;
  declare SendDMSessionMessage: (receiver_id: string, msg_type: number, content: string) => Promise<any>;

  declare getSearchHotwords: () => Promise<any>;
  declare searchContents: (keyword: string, vidcount?: number) => Promise<any>;
  declare searchContentWithType: (keyword: string, search_type: string) => Promise<any>;

  declare getDynamicList: (host_mid?: number, offset?: number) => Promise<any>;
}

Object.assign(
  BilibiliClient.prototype,
  loginMethods,
  videoMethods,
  videoActionMethods,
  articleMethods,
  favFolderMethods,
  historyMethods,
  userMethods,
  commentMethods,
  messageMethods,
  searchMethods,
  dynamicMethods,
);

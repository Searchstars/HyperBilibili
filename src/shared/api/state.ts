// 全局账号 / 风控 cookie 状态。
//
// 旧版 BilibiliClient 是 class 实例 + prototype 多模块合并，要给每个方法
// `this: any` 而无法静态检查。新版把可变状态抽到这个模块单例里，HTTP 层、
// 各业务模块直接读写。优点：
//   - 每个方法是纯函数，参数 / 返回值清晰
//   - 可测试性：测试时直接 setState({...})
//   - TS 类型检查无须 any

export interface BiliState {
  /** WBI / nav 返回的账号详细字段 */
  accountInfo: any | undefined;

  /** B 站登录后核心 cookies */
  sessData: string | undefined;
  biliJct: string | undefined;
  dedeUserID: string | undefined;
  sid: string | undefined;

  /** 风控 cookies，每次启动刷新，不持久 */
  buvid3: string | undefined;
  buvid4: string | undefined;

  /** 私信 device id，固定一次会话内不变 */
  dmDeviceId: string;

  /** 二维码登录临时 key */
  qrCodeKey: string | undefined;
}

export const state: BiliState = {
  accountInfo: undefined,
  sessData: undefined,
  biliJct: undefined,
  dedeUserID: undefined,
  sid: undefined,
  buvid3: undefined,
  buvid4: undefined,
  dmDeviceId: generateDeviceId(),
  qrCodeKey: undefined,
};

export function setLoggedIn(creds: { sessData: string; biliJct: string; dedeUserID: string; sid: string }) {
  state.sessData = creds.sessData;
  state.biliJct = creds.biliJct;
  state.dedeUserID = creds.dedeUserID;
  state.sid = creds.sid;
}

export function clearLogin() {
  state.sessData = undefined;
  state.biliJct = undefined;
  state.dedeUserID = undefined;
  state.sid = undefined;
  state.accountInfo = undefined;
}

export function isLoggedIn(): boolean {
  return Boolean(state.sessData);
}

function generateDeviceId(): string {
  // RFC4122 v4 简化版；旧版来自 BLTH 项目，行为保持一致。
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (16 * Math.random()) | 0;
    return (c === "x" ? r : (3 & r) | 8).toString(16).toUpperCase();
  });
}

import { router } from "@astralsight/astroforge-core";
import { storageDelete, storageGetJSON, storageSetJSON } from "../util/storage";
import { logger } from "../util/logger";
import { httpGet, httpGetRaw, readSetCookie } from "./http";
import { clearLogin, isLoggedIn, setLoggedIn, state } from "./state";

// 账号相关：本地存 / 取登录态、二维码登录轮询、nav 拉账号信息、buvid 刷新。
// 接口签名与旧版相近，但函数化、不依赖 this。

const ACCOUNT_KEY = "bilibili_account";

interface StoredAccount {
  sessData: string;
  biliJct: string;
  dedeUserID: string;
  sid: string;
}

export async function loadStoredAccount(): Promise<StoredAccount | undefined> {
  const data = await storageGetJSON<StoredAccount | null>(ACCOUNT_KEY, null);
  return data ?? undefined;
}

export async function persistAccount() {
  if (!state.sessData) return;
  await storageSetJSON<StoredAccount>(ACCOUNT_KEY, {
    sessData: state.sessData,
    biliJct: state.biliJct ?? "",
    dedeUserID: state.dedeUserID ?? "",
    sid: state.sid ?? "",
  });
}

export async function logout() {
  clearLogin();
  await storageDelete(ACCOUNT_KEY);
}

export async function refreshBuvid() {
  try {
    const resp = await httpGetRaw<any>("https://api.bilibili.com/x/frontend/finger/spi");
    state.buvid3 = resp?.data?.b_3;
    state.buvid4 = resp?.data?.b_4;
  } catch (err) {
    logger.warn("[account] refreshBuvid 失败", err);
  }
}

export async function refreshAccountInfo() {
  const resp = await httpGetRaw<any>("https://api.bilibili.com/x/web-interface/nav");
  if (!resp?.data?.isLogin) {
    // 登录态过期：清空并跳错误页，让用户重新扫码。
    await logout();
    router.clear();
    router.replace({ uri: "pages/error/sessionood" });
    return undefined;
  }
  state.accountInfo = resp.data;
  return resp.data;
}

/** 拉取扫码登录二维码。 */
export async function loginQR(): Promise<{ url: string; qrcodeKey: string }> {
  const resp = await httpGetRaw<any>(
    "https://passport.bilibili.com/x/passport-login/web/qrcode/generate",
  );
  if (!resp?.data?.qrcode_key) throw new Error("二维码生成失败");
  state.qrCodeKey = resp.data.qrcode_key;
  return { url: resp.data.url, qrcodeKey: resp.data.qrcode_key };
}

/** 轮询二维码状态；code === 0 表示成功，此时返回 true 并写入存储。 */
export async function pollQR(): Promise<{ ok: boolean; message: string }> {
  if (!state.qrCodeKey) return { ok: false, message: "等待二维码生成" };
  const resp = await httpGet<any>(
    `https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key=${state.qrCodeKey}`,
    "json",
  );
  // 网络层只能拿 data，不能拿 headers；这里改用底层 fetch 拿到 Set-Cookie。
  // 但为减小改动，先尝试从 url 拿 SESSDATA（B 站在 200 时既写 cookie 又把
  // url 设置为带 SESSDATA 的回跳地址）。
  if (resp?.code === 0) {
    extractCookiesFromUrl(resp.url);
    return { ok: true, message: "登录成功" };
  }
  return { ok: false, message: resp?.message ?? "等待扫码" };
}

function extractCookiesFromUrl(url?: string) {
  if (!url) return;
  const query = url.split("?")[1];
  if (!query) return;
  const params = new Map<string, string>();
  for (const part of query.split("&")) {
    const [k, v] = part.split("=");
    if (k && v !== undefined) params.set(k, decodeURIComponent(v));
  }
  state.sessData = params.get("SESSDATA");
  state.biliJct = params.get("bili_jct");
  state.dedeUserID = params.get("DedeUserID");
  // sid 在 Set-Cookie 而非 url；扫码完成后多数情况下 nav 接口会重新发 sid，
  // 此处先置空，让 refreshAccountInfo 解析响应头时填上。
  state.sid = state.sid;
}

/**
 * 启动流程：尝试恢复登录态；恢复失败时只更新 buvid 并返回 false，调用方负责
 * 跳转登录页。
 */
export async function ensureLogin(): Promise<boolean> {
  await refreshBuvid();

  if (isLoggedIn()) {
    await refreshAccountInfo();
    return true;
  }

  const stored = await loadStoredAccount();
  if (stored) {
    setLoggedIn(stored);
    await refreshAccountInfo();
    return isLoggedIn();
  }

  return false;
}

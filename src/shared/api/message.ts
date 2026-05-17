import { httpGetRaw, httpGetWbiRaw, httpPostWbi } from "./http";
import { state } from "./state";

export async function messageUnreadFeed() {
  const raw = await httpGetRaw<any>("https://api.vc.bilibili.com/x/im/web/msgfeed/unread");
  return raw?.data;
}

export async function dmSessions(sessionType: number, sortRule: number) {
  const raw = await httpGetWbiRaw<any>(
    "https://api.vc.bilibili.com/session_svr/v1/session_svr/get_sessions",
    { session_type: sessionType, sort_rule: sortRule, group_fold: 0, unfollow_fold: 0, mobi_app: "web" },
  );
  return raw?.data;
}

export async function dmSessionMessages(sessionType: number, talkerId: string, size = 10, endSeqno?: string) {
  const params: Record<string, unknown> = { session_type: sessionType, talker_id: talkerId, size };
  if (endSeqno) params.end_seqno = endSeqno;
  const raw = await httpGetWbiRaw<any>(
    "https://api.vc.bilibili.com/svr_sync/v1/svr_sync/fetch_session_msgs",
    params,
  );
  return raw?.data;
}

export async function sendDM(receiverId: string, msgType: number, content: string) {
  const senderId = state.accountInfo?.mid;
  const timestamp = Math.floor(Date.now() / 1000);
  const payload = encodeURIComponent(JSON.stringify({ content }));
  const body = [
    `msg[sender_uid]=${senderId}`,
    `msg[receiver_id]=${receiverId}`,
    `msg[receiver_type]=1`,
    `msg[msg_type]=${msgType}`,
    `msg[dev_id]=${state.dmDeviceId}`,
    `msg[timestamp]=${timestamp}`,
    `msg[content]=${payload}`,
    `csrf=${state.biliJct ?? ""}`,
    `csrf_token=${state.biliJct ?? ""}`,
    `msg[msg_status]=0`,
    `msg[new_face_version]=0`,
    `from_firework=0`,
    `build=0`,
    `mobi_app=web`,
  ].join("&");

  const headers = {
    Host: "api.vc.bilibili.com",
    Origin: "https://message.bilibili.com",
    Referer: "https://message.bilibili.com/",
  };

  return httpPostWbi(
    "https://api.vc.bilibili.com/web_im/v1/web_im/send_msg",
    {
      w_sender_uid: senderId,
      w_receiver_id: receiverId,
      w_dev_id: state.dmDeviceId,
    },
    body,
    "application/x-www-form-urlencoded",
    headers,
  );
}

export const messageMethods = {
  async getMessageNotifyFeed(this: any): Promise<any> {
    const response = await this.getRequest(
      "https://api.vc.bilibili.com/x/im/web/msgfeed/unread",
    );
    return response.data.data;
  },

  async getDMSessions(this: any, session_type: number, sort_rule: number): Promise<any> {
    const response = await this.getRequestWbi(
      "https://api.vc.bilibili.com/session_svr/v1/session_svr/get_sessions",
      {
        session_type,
        sort_rule,
        group_fold: 0,
        unfollow_fold: 0,
        mobi_app: "web",
      },
    );
    return response.data.data;
  },

  async getDMSessionMessage(
    this: any,
    session_type: number,
    talker_id: string,
    size: number = 10,
    end_seqno: string,
  ): Promise<any> {
    const params: Record<string, any> = { session_type, talker_id, size };
    if (end_seqno) params.end_seqno = end_seqno;
    const response = await this.getRequestWbi(
      "https://api.vc.bilibili.com/svr_sync/v1/svr_sync/fetch_session_msgs",
      params,
    );
    return response.data.data;
  },

  async SendDMSessionMessage(
    this: any,
    receiver_id: string,
    msg_type: number,
    content: string,
  ): Promise<any> {
    const body =
      `msg[sender_uid]=${this.accountInfo.mid}` +
      `&msg[receiver_id]=${receiver_id}` +
      `&msg[receiver_type]=1` +
      `&msg[msg_type]=${msg_type}` +
      `&msg[dev_id]=${this.dm_deviceid}` +
      `&msg[timestamp]=${Math.floor(Date.now() / 1000)}` +
      `&msg[content]=${encodeURIComponent(JSON.stringify({ content }))}` +
      `&csrf=${this.biliJct}` +
      `&csrf_token=${this.biliJct}` +
      `&msg[msg_status]=0&msg[new_face_version]=0&from_firework=0&build=0&mobi_app=web`;

    const headers: Record<string, string> = {
      ...this.getHeaders(),
      "Content-Type": "application/x-www-form-urlencoded",
      Host: "api.vc.bilibili.com",
      Origin: "https://message.bilibili.com",
      Referer: "https://message.bilibili.com/",
      "Content-Length": body.length.toString(),
    };

    const response = await this.postRequestWbi(
      "https://api.vc.bilibili.com/web_im/v1/web_im/send_msg",
      {
        w_sender_uid: this.accountInfo.mid,
        w_receiver_id: receiver_id,
        w_dev_id: this.dm_deviceid,
      },
      body,
      "application/x-www-form-urlencoded",
      headers,
    );

    return response.data;
  },
};

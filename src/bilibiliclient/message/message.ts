export const BilibiliClientMessageMethods = {
    // 获取通知信息数量 （例如回复我的、at我的、点赞数量）
    async getMessageNotifyFeed(this: any) {
        const url = "https://api.vc.bilibili.com/x/im/web/msgfeed/unread";
        const response = await this.getRequest(url);
        return response.data.data;
    },

    // 获取私信Session列表
    // 一次性最多拉取20个，可加end_ts做IFS（但没必要）
    async getDMSessions(this: any, session_type: number, sort_rule: number) {
        const url = "https://api.vc.bilibili.com/session_svr/v1/session_svr/get_sessions"
        const response = await this.getRequestWbi(url, {
            session_type,
            sort_rule,
            group_fold: 0,
            unfollow_fold: 0,
            mobi_app: "web"
        })

        return response.data.data
    },

    // 获取私信Session聊天记录
    // 若要做IFS，则end_seqno应该为最顶上那条信息的序列号
    // 接口有漏洞，自带防撤回
    async getDMSessionMessage(this: any, session_type: number, talker_id: string, size: number = 10, end_seqno: string) {
        const url = "https://api.vc.bilibili.com/svr_sync/v1/svr_sync/fetch_session_msgs"
        var params = {
            session_type,
            talker_id,
            size
        };
        if (end_seqno) {
            params["end_seqno"] = end_seqno;
        }
        const response = await this.getRequestWbi(url, params);

        return response.data.data
    },

    // 发送私信消息
    async SendDMSessionMessage(this: any, receiver_id: string, msg_type: number, content: string) {
        const url = "https://api.vc.bilibili.com/web_im/v1/web_im/send_msg";
        const body = `msg[sender_uid]=${this.accountInfo.mid}&msg[receiver_id]=${receiver_id}&msg[receiver_type]=1&msg[msg_type]=${msg_type}&msg[dev_id]=${this.dm_deviceid}&msg[timestamp]=${Number.parseInt(((new Date()).getTime() / 1000).toString())}&msg[content]=${encodeURIComponent(JSON.stringify({"content": `${content}`}))}&csrf=${this.biliJct}&csrf_token=${this.biliJct}&msg[msg_status]=0&msg[new_face_version]=0&from_firework=0&build=0&mobi_app=web`;

        var headers = { ...this.getHeaders(), "Content-Type": "application/x-www-form-urlencoded" }
        headers["Host"] = "api.vc.bilibili.com"
        headers["Origin"] = "https://message.bilibili.com"
        headers["Referer"] = "https://message.bilibili.com/"
        headers["Content-Length"] = body.length.toString()

        const response = await this.postRequestWbi(url, {
            w_sender_uid: this.accountInfo.mid,
            w_receiver_id: receiver_id,
            w_dev_id: this.dm_deviceid
        }, body, "application/x-www-form-urlencoded", headers);

        return response.data
    },
};
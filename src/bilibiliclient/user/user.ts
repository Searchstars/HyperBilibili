export const BilibiliClientUserMethods = {
    // 获取单个用户的信息
    async getUserInfoByUID(this: any, uid: String) {
        const url = `https://api.bilibili.com/x/space/wbi/acc/info`;
        const response = await this.getRequestWbi(url, {
            mid: uid
        });

        return response.data.data
    },

    // 获取单个用户的状态数
    async getUserStatByUID(this: any, uid: String) {
        const url = `https://api.bilibili.com/x/relation/stat`;
        const response = await this.getRequest(`${url}?vmid=${uid}`);

        return response.data.data
    },

    // 获取单个用户投稿的视频的代表作
    async getUserMasterPieceByUID(this: any, uid: String) {
        const url = `https://api.bilibili.com/x/space/masterpiece`;
        const response = await this.getRequest(`${url}?vmid=${uid}`);

        return response.data.data
    },

    // 获取用户投稿列表（分页）
    async getUserVideosByUID(this: any, uid: String, pn: Number, ps: Number = 5) {
        const url = `https://api.bilibili.com/x/space/wbi/arc/search`;
        const response = await this.getRequestWbi(url, {
            mid: uid,
            pn,
            ps
        });

        return response.data.data
    },

    // 获取用户空间动态列表
    async getUserDynamicListByUID(this: any, uid: String) {
        const url = `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space`;
        const response = await this.getRequest(`${url}?host_mid=${uid}`);

        return response.data.data
    },

    // 获取单个用户的导航栏状态数
    async getUserNavnumByUID(this: any, uid: String) {
        const url = `https://api.bilibili.com/x/space/navnum`;
        const response = await this.getRequest(`${url}?mid=${uid}`);

        return response.data.data
    },

    // 根据UID批量获取用户信息
    async getMultiUserInfoByUID(this: any, uids: Array<String>) {
        const url = "https://api.bilibili.com/x/polymer/pc-electron/v1/user/cards";
        let param = "";
        uids.forEach(uid => {
            if(uid.toString().length > 0){
                param += uid
                if (uids.indexOf(uid) != uids.length - 1) {
                    param += ","
                }
            }
        });
        const response = await this.getRequest(`${url}?uids=${param}`)

        return response.data.data
    }
}
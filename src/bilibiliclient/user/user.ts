export const BilibiliClientUserMethods = {
    // 获取单个用户的信息
    async getUserInfoByUID(this: any, uid: String) {
        const url = `https://api.bilibili.com/x/space/wbi/acc/info`;
        const response = await this.getRequestWbi(url, {
            mid: uid
        })

        return response.data.data
    },

    // 根据UID批量获取用户信息
    async getMultiUserInfoByUID(this: any, uids: Array<String>) {
        const url = "https://api.bilibili.com/x/polymer/pc-electron/v1/user/cards";
        let param = "";
        uids.forEach(uid => {
            param += uid
            if (uids.indexOf(uid) != uids.length - 1) {
                param += ","
            }
        });
        const response = await this.getRequest(`${url}?uids=${param}`)

        return response.data.data
    }
}
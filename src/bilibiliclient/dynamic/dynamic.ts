export const BilibiliClientDynamicMethods = {
    async getDynamicList(this: any, host_mid: number = 0, offset: number = 0): Promise<any>{
        let url = `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all?platform=web`
        if (host_mid) url += `&host_mid=${host_mid}`;
        if (offset) url += `&offset=${offset}`;

        const response = await this.getRequest(url);
        return response.data.data;
    }
}
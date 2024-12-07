export const BilibiliClientArticleMethods = {
    // 获取专栏网页HTML（需要过parser才能使用）
    async getArticle(this: any, cvid: string, useNewOpusArticle = true): Promise<any> {
        var url = `https://www.bilibili.com/read/${cvid}`;
        if(!useNewOpusArticle){
            url += "?jump_opus=1"
        }
        const response = await this.getRequest(url, "text");

        return response.data;
    }
}
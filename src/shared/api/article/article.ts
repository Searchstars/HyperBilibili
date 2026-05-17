export const articleMethods = {
  async getArticle(this: any, cvid: string, useNewOpusArticle = true): Promise<any> {
    let url = `https://www.bilibili.com/read/${cvid}`;
    if (!useNewOpusArticle) url += "?jump_opus=1";
    const response = await this.getRequest(url, "text");
    return response.data;
  },
};

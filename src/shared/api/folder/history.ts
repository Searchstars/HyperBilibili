export const historyMethods = {
  async getWatchHistory(this: any, pn: number, ps: number): Promise<any> {
    const response = await this.getRequest(
      `https://api.bilibili.com/x/v2/history?pn=${pn}&ps=${ps}`,
    );
    return response.data.data;
  },
};

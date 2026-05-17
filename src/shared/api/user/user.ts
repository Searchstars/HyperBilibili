export const userMethods = {
  async getUserInfoByUID(this: any, uid: string): Promise<any> {
    const response = await this.getRequestWbi(
      "https://api.bilibili.com/x/space/wbi/acc/info",
      { mid: uid },
    );
    return response.data.data;
  },

  async getUserStatByUID(this: any, uid: string): Promise<any> {
    const response = await this.getRequest(
      `https://api.bilibili.com/x/relation/stat?vmid=${uid}`,
    );
    return response.data.data;
  },

  async getUserMasterPieceByUID(this: any, uid: string): Promise<any> {
    const response = await this.getRequest(
      `https://api.bilibili.com/x/space/masterpiece?vmid=${uid}`,
    );
    return response.data.data;
  },

  async getUserVideosByUID(this: any, uid: string, pn: number, ps: number = 5): Promise<any> {
    const response = await this.getRequestWbi(
      "https://api.bilibili.com/x/space/wbi/arc/search",
      { mid: uid, pn, ps },
    );
    return response.data.data;
  },

  async getUserDynamicListByUID(this: any, uid: string): Promise<any> {
    const response = await this.getRequest(
      `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?host_mid=${uid}`,
    );
    return response.data.data;
  },

  async getUserNavnumByUID(this: any, uid: string): Promise<any> {
    const response = await this.getRequest(
      `https://api.bilibili.com/x/space/navnum?mid=${uid}`,
    );
    return response.data.data;
  },

  async getMultiUserInfoByUID(this: any, uids: string[]): Promise<any> {
    const param = uids.filter((u) => u && u.length > 0).join(",");
    const response = await this.getRequest(
      `https://api.bilibili.com/x/polymer/pc-electron/v1/user/cards?uids=${param}`,
    );
    return response.data.data;
  },
};

export const commentMethods = {
  async getReplies(
    this: any,
    type: string,
    oid: string,
    pn: number = 1,
    ps: number = 10,
    sort: number = 1,
  ): Promise<any> {
    const response = await this.getRequest(
      `https://api.bilibili.com/x/v2/reply?type=${type}&oid=${oid}&pn=${pn}&ps=${ps}&sort=${sort}`,
    );
    return response.data.data;
  },

  async getSecReplies(
    this: any,
    type: string,
    oid: string,
    root: string,
    pn: number = 1,
    ps: number = 10,
  ): Promise<any> {
    const response = await this.getRequest(
      `https://api.bilibili.com/x/v2/reply/reply?type=${type}&oid=${oid}&pn=${pn}&ps=${ps}&root=${root}`,
    );
    return response.data.data;
  },

  async LikeReply(this: any, type: string, oid: string, rpid: string, action: number): Promise<any> {
    const body = `type=${type}&oid=${oid}&rpid=${rpid}&action=${action}&csrf=${this.biliJct}`;
    const response = await this.postRequest(
      "https://api.bilibili.com/x/v2/reply/action",
      body,
      "application/x-www-form-urlencoded",
    );
    return response.data;
  },

  async GiveReply(this: any, type: string, oid: string, message: string): Promise<any> {
    const body = `type=${type}&oid=${oid}&message=${message}&plat=1&csrf=${this.biliJct}`;
    const response = await this.postRequest(
      "https://api.bilibili.com/x/v2/reply/add",
      body,
      "application/x-www-form-urlencoded",
    );
    return response.data;
  },

  async GiveSecReply(this: any, type: string, oid: string, parent: string, message: string): Promise<any> {
    const body = `type=${type}&oid=${oid}&parent=${parent}&message=${message}&plat=1&csrf=${this.biliJct}`;
    const response = await this.postRequest(
      "https://api.bilibili.com/x/v2/reply/add",
      body,
      "application/x-www-form-urlencoded",
    );
    return response.data;
  },

  async GiveTreeReply(
    this: any,
    type: string,
    oid: string,
    parent: string,
    root: string,
    message: string,
  ): Promise<any> {
    const body = `type=${type}&oid=${oid}&parent=${parent}&root=${root}&message=${message}&plat=1&csrf=${this.biliJct}`;
    const response = await this.postRequest(
      "https://api.bilibili.com/x/v2/reply/add",
      body,
      "application/x-www-form-urlencoded",
    );
    return response.data;
  },
};

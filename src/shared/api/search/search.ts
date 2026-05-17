export const searchMethods = {
  async getSearchHotwords(this: any): Promise<any> {
    const response = await this.getRequest("https://s.search.bilibili.com/main/hotword");
    return response.data.list;
  },

  async searchContents(this: any, keyword: string, vidcount: number = 20): Promise<any> {
    const response = await this.getRequestWbi(
      "https://api.bilibili.com/x/web-interface/wbi/search/all/v2",
      { keyword },
    );

    const result: { users: any[]; videos: any[]; comprehensive_videos: any[] } = {
      users: [],
      videos: [],
      comprehensive_videos: [],
    };

    response.data.data.result.forEach((arr: any) => {
      switch (arr.result_type) {
        case "bili_user":
          result.users = arr.data;
          break;
        case "video":
          arr.data.forEach((vid: any) => {
            if (vid.bvid) result.videos.push(vid);
          });
          break;
      }
    });

    result.comprehensive_videos = result.videos.slice(0, 5);
    result.videos = result.videos.slice(0, vidcount);
    return result;
  },

  async searchContentWithType(this: any, keyword: string, search_type: string): Promise<any> {
    console.log("[search] keyword=", keyword, "type=", search_type);
    const response = await this.getRequestWbi(
      "https://api.bilibili.com/x/web-interface/wbi/search/type",
      { keyword, search_type },
    );
    return response.data.data;
  },
};

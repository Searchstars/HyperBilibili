export const BilibiliClientSearchMethods = {
    // 获取搜索热词
    async getSearchHotwords(this: any): Promise<any> {
        const url = "https://s.search.bilibili.com/main/hotword";
        const response = await this.getRequest(url);
        return response.data.list;
    },

    // 全站搜索（首页入口）（视频、用户）
    async searchContents(this: any, keyword: string, vidcount: number = 20): Promise<any> {
        const url = "https://api.bilibili.com/x/web-interface/wbi/search/all/v2";
        const response = await this.getRequestWbi(url, { keyword });

        let result = { users: [], videos: [], comprehensive_videos: [] };

        response.data.data.result.forEach((result_array: any) => {
            switch (result_array.result_type) {
                case "bili_user":
                    result.users = result_array.data;
                    break;
                case "video":
                    result_array.data.forEach((vid: any) => {
                        if (vid.bvid) {
                            result.videos.push(vid)
                        }
                    });
                    break;
            }
        });

        result.comprehensive_videos = result.videos.slice(0, 5);
        result.videos = result.videos.slice(0, vidcount)

        return result;
    },

    // 全站搜索，但是按类型细分
    async searchContentWithType(this: any, keyword: string, search_type: string) {
        global.logger.log("[searchContentWithType] keyword=" + keyword + " type=" + search_type)
        const url = "https://api.bilibili.com/x/web-interface/wbi/search/type"
        const response = await this.getRequestWbi(url, {
            keyword,
            search_type
        })

        return response.data.data;
    },
};

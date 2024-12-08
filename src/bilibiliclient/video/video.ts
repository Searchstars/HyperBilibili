export const BilibiliClientVideoMethods = {
    // 获取首页视频推荐
    async getMainPageRecommendVideos(this: any, fresh_type: number, pagesize: number): Promise<any> {
        const url = `https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=${fresh_type}&ps=${pagesize}&version=1`;
        const response = await this.getRequest(url);
        return response.data.data.item;
    },

    // 根据视频BV号获取视频详情信息
    async getVideoInfoByBVID(this: any, bvid: string): Promise<any> {
        const url = `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`;
        const response = await this.getRequest(url);
        return response.data.data;
    },

    // 判断视频是否被点赞
    async isVideoLikedByBVID(this: any, bvid: string): Promise<boolean> {
        const url = `https://api.bilibili.com/x/web-interface/archive/has/like?bvid=${bvid}`;
        const response = await this.getRequest(url);
        return response.data.data;
    },

    // 判断视频是否被投币
    async isVideoCoinedByBVID(this: any, bvid: string): Promise<boolean> {
        const url = `https://api.bilibili.com/x/web-interface/archive/coins?bvid=${bvid}`;
        const response = await this.getRequest(url);
        return response.data.data.multiply;
    },

    // 判断视频是否被收藏
    async isVideoStaredByBVID(this: any, bvid: string): Promise<boolean> {
        const url = `https://api.bilibili.com/x/v2/fav/video/favoured?aid=${bvid}`;
        const response = await this.getRequest(url);
        return response.data.data.favoured;
    },

    // 获取视频AI摘要
    async getVideoAISummaryByBVID(this: any, bvid: string, cid: string, up_mid: string) {
        const url = "https://api.bilibili.com/x/web-interface/view/conclusion/get";
        const response = await this.getRequestWbi(url, { bvid, cid, up_mid });
        return response.data.data.model_result.summary;
    },

    // 获取根据BVID与CID获取视频MP4流地址
    async getVideoMP4StreamByBVID(this: any, cid: string, bvid: string, qn: string = "32") {
        const url = `https://api.bilibili.com/x/player/wbi/playurl`;
        const response = await this.getRequestWbi(url, {
            cid,
            bvid,
            qn,
            fnval: "1",
            platform: "html5"
        });

        global.logger.log(response);
        return response.data.data;
    },
};
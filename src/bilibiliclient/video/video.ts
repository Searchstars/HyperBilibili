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

    async getVideoBestAudioUrlByBVID(this: any, bvid: string): Promise<string> {
        const info = await this.getVideoInfoByBVID(bvid);
        const cid = info.cid || info.pages?.[0]?.cid;
        if (!cid) {
            throw new Error("cid not found");
        }

        const url = `https://api.bilibili.com/x/player/wbi/playurl`;
        const response = await this.getRequestWbi(url, {
            bvid,
            cid,
            fnval: 4048,
            fourk: 1,
            platform: "pc"
        });

        const payload = response && response.data ? response.data : response;
        if (!payload) {
            global.logger.error("[getVideoBestAudioUrlByBVID] empty response");
            throw new Error("empty response");
        }
        global.logger.log("[getVideoBestAudioUrlByBVID] response code:", payload.code, "message:", payload.message);

        const dash = payload.data?.dash || payload.dash;
        const audioTracks = dash?.audio || [];
        global.logger.log("[getVideoBestAudioUrlByBVID] audioTracks length:", audioTracks.length);
        if (!audioTracks.length) {
            const keys = Object.keys(payload.data || payload || {});
            global.logger.error("[getVideoBestAudioUrlByBVID] no audio tracks, payload keys:", keys);
            throw new Error("audio stream not found");
        }

        audioTracks.sort((a: any, b: any) => (b.bandwidth || 0) - (a.bandwidth || 0));
        const best = audioTracks[0] || {};

        const candidates: Array<string> = [];
        const baseUrl = best.baseUrl || best.base_url;
        if (baseUrl) candidates.push(baseUrl);

        const backupUrls = best.backupUrl || best.backup_url;
        if (Array.isArray(backupUrls)) {
            backupUrls.forEach((u: any) => {
                if (typeof u === "string" && u.length > 0) candidates.push(u);
            });
        }

        const uniqueCandidates = candidates.filter((u, idx) => candidates.indexOf(u) === idx);
        uniqueCandidates.sort((a, b) => {
            const score = (u: string) => {
                let s = 0;
                if (u.includes("mcdn")) s -= 10;
                if (u.includes("upos")) s += 2;
                return s;
            };
            return score(b) - score(a);
        });

        const selected = uniqueCandidates[0];
        global.logger.log("[getVideoBestAudioUrlByBVID] selected url:", selected);
        return selected;
    },
};

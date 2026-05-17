export const videoMethods = {
  async getMainPageRecommendVideos(this: any, fresh_type: number, pagesize: number): Promise<any> {
    const url = `https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=${fresh_type}&ps=${pagesize}&version=1`;
    const response = await this.getRequest(url);
    return response.data.data.item;
  },

  async getVideoInfoByBVID(this: any, bvid: string): Promise<any> {
    const response = await this.getRequest(
      `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`,
    );
    return response.data.data;
  },

  async isVideoLikedByBVID(this: any, bvid: string): Promise<boolean> {
    const response = await this.getRequest(
      `https://api.bilibili.com/x/web-interface/archive/has/like?bvid=${bvid}`,
    );
    return response.data.data;
  },

  async isVideoCoinedByBVID(this: any, bvid: string): Promise<boolean> {
    const response = await this.getRequest(
      `https://api.bilibili.com/x/web-interface/archive/coins?bvid=${bvid}`,
    );
    return response.data.data.multiply;
  },

  async isVideoStaredByBVID(this: any, bvid: string): Promise<boolean> {
    const response = await this.getRequest(
      `https://api.bilibili.com/x/v2/fav/video/favoured?aid=${bvid}`,
    );
    return response.data.data.favoured;
  },

  async getVideoAISummaryByBVID(this: any, bvid: string, cid: string, up_mid: string): Promise<any> {
    const response = await this.getRequestWbi(
      "https://api.bilibili.com/x/web-interface/view/conclusion/get",
      { bvid, cid, up_mid },
    );
    return response.data.data.model_result.summary;
  },

  async getVideoMP4StreamByBVID(this: any, cid: string, bvid: string, qn: string = "32"): Promise<any> {
    const response = await this.getRequestWbi(
      "https://api.bilibili.com/x/player/wbi/playurl",
      { cid, bvid, qn, fnval: "1", platform: "html5" },
    );
    return response.data.data;
  },

  async getVideoBestAudioUrlByBVID(this: any, bvid: string): Promise<string> {
    const info = await this.getVideoInfoByBVID(bvid);
    const cid = info.cid || info.pages?.[0]?.cid;
    if (!cid) throw new Error("cid not found");

    const response = await this.getRequestWbi(
      "https://api.bilibili.com/x/player/wbi/playurl",
      { bvid, cid, fnval: 4048, fourk: 1, platform: "pc" },
    );

    const payload = response?.data ?? response;
    if (!payload) throw new Error("empty response");

    const dash = payload.data?.dash ?? payload.dash;
    const audioTracks: any[] = dash?.audio || [];
    if (!audioTracks.length) throw new Error("audio stream not found");

    audioTracks.sort((a, b) => (b.bandwidth || 0) - (a.bandwidth || 0));
    const best = audioTracks[0] || {};

    const candidates: string[] = [];
    const baseUrl = best.baseUrl || best.base_url;
    if (baseUrl) candidates.push(baseUrl);
    const backupUrls = best.backupUrl || best.backup_url;
    if (Array.isArray(backupUrls)) {
      backupUrls.forEach((u: any) => {
        if (typeof u === "string" && u.length > 0) candidates.push(u);
      });
    }

    const unique = candidates.filter((u, idx) => candidates.indexOf(u) === idx);
    unique.sort((a, b) => {
      const score = (u: string) => (u.includes("mcdn") ? -10 : 0) + (u.includes("upos") ? 2 : 0);
      return score(b) - score(a);
    });
    return unique[0];
  },
};

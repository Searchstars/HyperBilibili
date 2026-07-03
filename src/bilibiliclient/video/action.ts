export const BilibiliClientVideoActionMethods = {
    // 点赞视频
    async LikeVideo(this: any, bvid: string, like: number): Promise<any> {
        const url = "https://api.bilibili.com/x/web-interface/archive/like";
        const body = `bvid=${bvid}&like=${like}&csrf=${this.biliJct}`;
        const response = await this.postRequest(url, body, "application/x-www-form-urlencoded");
        return response.data;
    },

    // 投币视频
    async CoinVideo(this: any, bvid: string, multiply: number): Promise<any> {
        const url = "https://api.bilibili.com/x/web-interface/coin/add";
        const body = `bvid=${bvid}&multiply=${multiply}&csrf=${this.biliJct}`;
        const response = await this.postRequest(url, body, "application/x-www-form-urlencoded");
        return response.data;
    },

    // 收藏视频至默认收藏夹
    async starVideoToDefaultFavFolderByBVID(this: any, bvid: string): Promise<any> {
        let defaultFolderID = 0;
        const folders = await this.getUserFavouriteFolders(this.accountInfo.mid);
        folders.list.forEach((folder: any) => {
            if (folder.title === "默认收藏夹") {
                defaultFolderID = folder.id;
            }
        });
        if (!defaultFolderID) return false;

        try {
            const videoInfo = await this.getVideoInfoByBVID(bvid);
            const aid = videoInfo.aid;
            const url = `https://api.bilibili.com/x/v3/fav/resource/deal`;
            const data = `rid=${aid}&csrf=${this.biliJct}&type=2&add_media_ids=${defaultFolderID}&del_media_ids=`;
            const response = await this.postRequest(url, data, "application/x-www-form-urlencoded");
            return response.data.code;
        } catch (error) {
            global.logger.error("Error starring video: ", error);
            return false;
        }
    },

    // 取消收藏视频从默认收藏夹
    async unstarVideoFromDefaultFavFolderByBVID(this: any, bvid: string): Promise<any> {
        let defaultFolderID = 0;
        const folders = await this.getUserFavouriteFolders(this.accountInfo.mid);
        folders.list.forEach((folder: any) => {
            if (folder.title === "默认收藏夹") {
                defaultFolderID = folder.id;
            }
        });
        if (!defaultFolderID) return false;

        try {
            const videoInfo = await this.getVideoInfoByBVID(bvid);
            const aid = videoInfo.aid;
            const url = `https://api.bilibili.com/x/v3/fav/resource/deal`;
            const data = `rid=${aid}&csrf=${this.biliJct}&type=2&add_media_ids=&del_media_ids=${defaultFolderID}`;
            const response = await this.postRequest(url, data, "application/x-www-form-urlencoded");
            return response.data.code;
        } catch (error) {
            global.logger.error("Error unstarring video: ", error);
            return false;
        }
    },

    // 收藏视频至指定收藏夹（支持多个）
    async starVideoToFavFolders(this: any, aid: string, folderIds: string[]): Promise<any> {
        try {
            const add_media_ids = folderIds.join(',');
            const url = `https://api.bilibili.com/x/v3/fav/resource/deal`;
            const data = `rid=${aid}&csrf=${this.biliJct}&type=2&add_media_ids=${add_media_ids}&del_media_ids=`;
            const response = await this.postRequest(url, data, "application/x-www-form-urlencoded");
            return response.data.code;
        } catch (error) {
            global.logger.error("Error starring video to folders: ", error);
            return false;
        }
    },

    // 从指定收藏夹取消收藏视频（支持多个）
    async unstarVideoFromFavFolders(this: any, aid: string, folderIds: string[]): Promise<any> {
        try {
            const del_media_ids = folderIds.join(',');
            const url = `https://api.bilibili.com/x/v3/fav/resource/deal`;
            const data = `rid=${aid}&csrf=${this.biliJct}&type=2&add_media_ids=&del_media_ids=${del_media_ids}`;
            const response = await this.postRequest(url, data, "application/x-www-form-urlencoded");
            return response.data.code;
        } catch (error) {
            global.logger.error("Error unstarring video from folders: ", error);
            return false;
        }
    },
}
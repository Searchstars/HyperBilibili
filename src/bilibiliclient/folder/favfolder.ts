export const BilibiliClientFavFolderMethods = {
    // 获取用户创建的所有收藏夹信息
    async getUserFavouriteFolders(this: any, mid: string, type: number = 0, rid: string = null): Promise<any> {
        let url = `https://api.bilibili.com/x/v3/fav/folder/created/list-all?up_mid=${mid}&type=${type}`;
        if (rid) url += `&rid=${rid}`;
        const response = await this.getRequest(url);
        return response.data.data;
    },

    // 获取目标收藏夹元数据
    async getFavouriteFolderMetadata(this: any, mlid: string): Promise<any> {
        const url = `https://api.bilibili.com/x/v3/fav/folder/info?media_id=${mlid}`;
        const response = await this.getRequest(url);
        return response.data.data;
    },

    // 获取目标收藏夹内容
    async getFavouriteFolderContent(this: any, mlid: string, pn: number, ps: number = 10, keyword: string = null): Promise<any> {
        let url = `https://api.bilibili.com/x/v3/fav/resource/list?media_id=${mlid}&ps=${ps}&pn=${pn}`;
        if (keyword) url += `&keyword=${keyword}`;
        const response = await this.getRequest(url);
        return response.data.data;
    }
}
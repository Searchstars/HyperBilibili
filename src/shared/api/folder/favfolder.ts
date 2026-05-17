export const favFolderMethods = {
  async getUserFavouriteFolders(
    this: any,
    mid: string,
    type: number = 0,
    rid: string | null = null,
  ): Promise<any> {
    let url = `https://api.bilibili.com/x/v3/fav/folder/created/list-all?up_mid=${mid}&type=${type}`;
    if (rid) url += `&rid=${rid}`;
    const response = await this.getRequest(url);
    return response.data.data;
  },

  async getFavouriteFolderMetadata(this: any, mlid: string): Promise<any> {
    const response = await this.getRequest(
      `https://api.bilibili.com/x/v3/fav/folder/info?media_id=${mlid}`,
    );
    return response.data.data;
  },

  async getFavouriteFolderContent(
    this: any,
    mlid: string,
    pn: number,
    ps: number = 10,
    keyword: string | null = null,
  ): Promise<any> {
    let url = `https://api.bilibili.com/x/v3/fav/resource/list?media_id=${mlid}&ps=${ps}&pn=${pn}`;
    if (keyword) url += `&keyword=${keyword}`;
    const response = await this.getRequest(url);
    return response.data.data;
  },
};

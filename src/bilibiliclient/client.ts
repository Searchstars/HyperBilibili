import { fetch } from '../tsimports';

import { BilibiliClientLoginMethods } from './account/login';
import { BilibiliClientVideoMethods } from './video/video';
import { BilibiliClientVideoActionMethods } from './video/action';
import { BilibiliClientArticleMethods } from './article/article';
import { BilibiliClientFavFolderMethods } from './folder/favfolder';
import { BilibiliClientHistoryMethods } from './folder/history';
import { BilibiliClientUserMethods } from './user/user';
import { BilibiliClientCommentMethods } from './comment/comment';
import { BilibiliClientMessageMethods } from './message/message';
import { BilibiliClientSearchMethods } from './search/search';
import { BilibiliClientAPIRequestMethods } from './api/request';
import { BilibiliClientDynamicMethods } from './dynamic/dynamic';

class BilibiliClient {
    // 版本号
    public version: string = "2.5";

    // Fetch API
    // 在class内存储一个来适配不同实现
    public fetch: any;

    // 扫码登录用的二维码Key（临时存储）
    private qrCodeKey: string | null = null;

    // B站Cookies
    public sessData: string | null = null;
    public biliJct: string | null = null;
    public dedeUserID: string | null = null;
    public sid: string | null = null;

    // B站账号信息（非AccountData）
    public accountInfo: any | null = null;

    // 风控Cookies（不存储，构建biliclient时更新）
    private buvid3: string | null = null;
    private buvid4: string | null = null;

    // 私信DeviceId，每次登录刷新
    // From https://github.com/andywang425/BLTH/
    private dm_deviceid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (name) {
        let randomInt = 16 * Math.random() | 0;
        return ("x" === name ? randomInt : 3 & randomInt | 8).toString(16).toUpperCase()
    });

    constructor() {
        //@ts-ignore
        this.updateBUVID();
        this.fetch = fetch;
    }
}

// 将其他模块的方法添加到BilibiliClient的prototype上
Object.assign(BilibiliClient.prototype, 
    BilibiliClientLoginMethods,
    BilibiliClientAPIRequestMethods,
    BilibiliClientVideoMethods,
    BilibiliClientVideoActionMethods,
    BilibiliClientArticleMethods,
    BilibiliClientFavFolderMethods,
    BilibiliClientHistoryMethods,
    BilibiliClientUserMethods,
    BilibiliClientCommentMethods,
    BilibiliClientMessageMethods,
    BilibiliClientSearchMethods,
    BilibiliClientDynamicMethods
);

export { BilibiliClient };
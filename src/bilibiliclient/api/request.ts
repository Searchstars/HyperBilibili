import { crypto } from '../../tsimports';
import { getMixinKey } from '../utils/utils';
import semver from 'semver';
import * as eula from '../../eula';

// API请求相关的方法
export const BilibiliClientAPIRequestMethods = {

    // 获取请求头，用于模拟正常浏览器环境，降低风控概率
    getHeaders(this: any): Record<string, string> {
        return {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/jxl,image/webp,image/png,image/svg+xml,*/*;q=0.8',
            'Accept-Encoding': '',
            'Accept-Language': 'zh-CN,zh;q=0.8',
            'Cookie': this.getCookieString(),
            'Referer': 'https://www.bilibili.com',
            'Origin': 'https://www.bilibili.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0'
        };
    },

    // 构建Cookie字符串
    getCookieString(this: any): string {
        let cookies = `buvid3=${this.buvid3}; buvid4=${this.buvid4}; `;
        if (this.sessData) {
            cookies += `SESSDATA=${this.sessData}; bili_jct=${this.biliJct}; DedeUserID=${this.dedeUserID}; sid=${this.sid}; `;
        }
        // 专栏保持旧版
        cookies += "opus-goback=1"

        return cookies;
    },

    // Wbi签名
    encWbi(this: any, params: Record<string, any>, img_key: string, sub_key: string): string {
        const mixin_key = getMixinKey(img_key + sub_key);
        const curr_time = Math.floor(Date.now() / 1000);

        params.wts = curr_time; // 添加时间戳字段
        const query = Object.keys(params)
            .sort()
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key].toString().replace(/[!'()*]/g, ""))}`)
            .join("&");

        const wbi_sign = crypto.hashDigest({ data: query + mixin_key, algo: "MD5" });
        global.logger.log("wbi_sign: " + wbi_sign);

        return `${query}&w_rid=${wbi_sign}`;
    },

    // 发送GET请求
    async getRequest(this: any, url: string, responseType: string = "json"): Promise<any> {
        global.logger.log("getRequest: " + url);
        try {
            const response = await this.fetch.fetch({
                url,
                responseType: responseType,
                header: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            global.logger.error(`GET请求失败，详细数据：`, error);
        }

        return void 0;
    },

    // 发送带Wbi签名的GET请求
    async getRequestWbi(this: any, url: string, params: any): Promise<any> {
        const img_key = this.accountInfo.wbi_img.img_url.split('/').pop().split('.')[0];
        const sub_key = this.accountInfo.wbi_img.sub_url.split('/').pop().split('.')[0];
        const signedParams = this.encWbi(params, img_key, sub_key);
        return this.getRequest(`${url}?${signedParams}`);
    },

    // 发送POST请求
    async postRequest(this: any, url: string, data: string, content_type: string, custom_headers: any = null): Promise<any> {
        global.logger.log(`postRequest: ${url}, body: ${data}, contentType: ${content_type}`);
        let headers = { ...this.getHeaders(), "Content-Type": content_type }
        if (custom_headers) {
            headers = custom_headers
        }
        try {
            const response = await this.fetch.fetch({
                url,
                responseType: 'json',
                method: 'POST',
                data,
                header: headers
            });
            return response.data;
        } catch (error) {
            global.logger.error(`POST请求失败，详细数据：`, error);
        }

        return void 0;
    },

    // 发送带Wbi签名的POST请求
    async postRequestWbi(this: any, url: string, wbiParams: any, data: string, content_type: string, custom_headers: any = null): Promise<any> {
        const img_key = this.accountInfo.wbi_img.img_url.split('/').pop().split('.')[0];
        const sub_key = this.accountInfo.wbi_img.sub_url.split('/').pop().split('.')[0];
        const signedParams = this.encWbi(wbiParams, img_key, sub_key);
        return this.postRequest(`${url}?${signedParams}`, data, content_type, custom_headers);
    },

    // 检查澎湃哔哩是否存在更新
    async checkHyperbilibiliUpdates(this: any): Promise<any> {
        const latestVerGet = await this.fetch.fetch({
            url: "https://gitee.com/search__stars/hb_ota_info/raw/master/current_ver",
            header: this.getHeaders()
        });
        global.logger.log(latestVerGet.data);
        const latestVer = latestVerGet.data.data;
        if (semver.lt(this.version, latestVer)) {
            return {
                update: true,
                msg: `检查到更新v${latestVer}，请前往hyperbili.astralsight.space下载更新`
            };
        }
        return { update: false, msg: "" };
    },

    getEulaShowContent(this: any): any {
        // 使用硬编码的EULA文本
        // 因为部分地区可能无法访问境外加速CDN
        const response = {
            data: eula.eula
        };

        return response.data;
    },
};
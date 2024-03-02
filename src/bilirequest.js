import fetch from '@system.fetch'
import file from '@system.file'
import router from '@system.router'
import storage from '@system.storage'
import { ParseSetCookie } from './tools'
import { md5 } from './tinymd5'

let Inited = false
let DedeUserID = null
let DedeUserID__ckMd5 = null
let SESSDATA = null
let bili_jct = null
let buvid3 = null
let wbi_img_key = null
let wbi_sub_key = null

const BILI_BASE_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
    "TE": "trailers",
    "Referer": "https://www.bilibili.com",
    "Origin": "https://www.bilibili.com",
    "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
    "Accept": "*/*"
}

// From https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/misc/sign/wbi.md#JavaScript
const mixinKeyEncTab = [
    46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
    33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
    61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
    36, 20, 34, 44, 52
  ]
  
// 对 imgKey 和 subKey 进行字符顺序打乱编码
const getMixinKey = (orig) => mixinKeyEncTab.map(n => orig[n]).join('').slice(0, 32)

function encWbi(params, img_key, sub_key) {
    const mixin_key = getMixinKey(img_key + sub_key),
      curr_time = Math.round(Date.now() / 1000),
      chr_filter = /[!'()*]/g
  
    Object.assign(params, { wts: curr_time }) // 添加 wts 字段
    // 按照 key 重排参数
    const query = Object
      .keys(params)
      .sort()
      .map(key => {
        // 过滤 value 中的 "!'()*" 字符
        const value = params[key].toString().replace(chr_filter, '')
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      })
      .join('&')
  
    const wbi_sign = md5(query + mixin_key) // 计算 w_rid
  
    return query + '&w_rid=' + wbi_sign
}

export function InitBiliWbi(wbi_img){
    var img_key_parts = wbi_img.img_url.toString().split('/')
    var img_key = img_key_parts[img_key_parts.length - 1].split('.')[0]
    var sub_key_parts = wbi_img.sub_url.toString().split('/')
    var sub_key = sub_key_parts[sub_key_parts.length - 1].split('.')[0]
    
    console.log("img_key=" + img_key + " sub_key=" + sub_key)

    wbi_img_key = img_key
    wbi_sub_key = sub_key
}

export async function InitBiliBUVID3() {
    await new Promise((resolve, reject) => {
        storage.get({
            key: "BUVID3",
            success: async (data) => {
                if (data != "") {
                    try {
                        var req_homepage_ret = await SendBiliGETReturnAll("https://bilibili.com");
                        var headers = ParseSetCookie(req_homepage_ret.headers["Set-Cookie"]);
                        for (var i = 0; i < headers.length; i++) {
                            console.log(headers[i]);
                            if (headers[i]["buvid3"] !== void 0 && headers[i]["buvid3"] !== undefined && headers[i]["buvid3"] !== "") {
                                buvid3 = headers[i]["buvid3"];
                            }
                        }
                        storage.set({
                            key: "BUVID3",
                            value: buvid3.toString(),
                            success: (data) => {
                                console.log("Inited buvid3");
                                resolve(); // 成功回调后解决Promise
                            },
                            fail: () => reject(), // 如果set失败，拒绝Promise
                        });
                    } catch (error) {
                        reject(error); // 如果在尝试过程中抛出错误，拒绝Promise
                    }
                } else {
                    // 如果data是空的，也解决Promise，但这种情况可能需要特别处理
                    buvid3 = data;
                    resolve();
                }
            },
            fail: () => reject(), // 如果get失败，拒绝Promise
        });
    });
}


// JumpToHomePage: bool
// 用于设置是否在初始化完BiliRequest后跳转到Home页
export async function InitBiliRequest(JumpToHomePage){
    try{
        console.log("开始初始化BiliRequest")
        file.readText({
            uri: "internal://files/hbili_DedeUserID.txt",
            success: function(DUIDReadRet){
                console.log(DUIDReadRet)
                DedeUserID = DUIDReadRet.text
                file.readText({
                    uri: "internal://files/hbili_DedeUserID__ckMd5.txt",
                    success: function(DUIDMD5ReadRet){
                        console.log(DUIDMD5ReadRet)
                        DedeUserID__ckMd5 = DUIDMD5ReadRet.text
                        file.readText({
                            uri: "internal://files/hbili_SESSDATA.txt",
                            success: function(SESSDATAReadRet){
                                console.log(SESSDATAReadRet)
                                SESSDATA = SESSDATAReadRet.text
                                file.readText({
                                    uri: "internal://files/hbili_bili_jct.txt",
                                    success: function(BiliJCTReadRet){
                                        console.log(BiliJCTReadRet)
                                        bili_jct = BiliJCTReadRet.text
                                        console.log("bilirequest初始化完毕: \nDedeUserID=" + DedeUserID + "\nDedeUserID__ckMd5=" + DedeUserID__ckMd5 + "\nSESSDATA=" + SESSDATA + "\nbili_jct=" + bili_jct)
                                        Inited = true
                                        if(JumpToHomePage){
                                            router.push({
                                                uri: "pages/home"
                                            })
                                        }
                                    },
                                    fail: function(data, code) {
                                        console.log(`brequest.init.hbilibilijct > handling fail, code = ${code}`)
                                    }
                                })
                            },
                            fail: function(data, code) {
                                console.log(`brequest.init.sessdata_read > handling fail, code = ${code}`)
                            }
                        })
                    },
                    fail: function(data, code) {
                        console.log(`brequest.init.dedeuseridmd5_read > handling fail, code = ${code}`)
                    }
                })
            },
            fail: function(data, code) {
                console.log(`brequest.init.dedeuserid_read > handling fail, code = ${code}`)
            }
        })
    }
    catch(err){
        console.log("BiliRequest初始化失败，错误信息：" + err)
    }
}

export async function SendBiliGET(url, type){
    var headers = BILI_BASE_HEADERS;
    headers["Cookie"] = "DedeUserID=" + DedeUserID + "; DedeUserID__ckMd5=" + DedeUserID__ckMd5 + "; SESSDATA=" + SESSDATA + "; bili_jct=" + bili_jct + "; buvid3=" + buvid3;
    var ret = await fetch.fetch({
        url: url,
        responseType: type,
        header: headers
    });
    return ret.data.data
}

export async function SendBiliGETReturnAll(url, type){
    var headers = BILI_BASE_HEADERS;
    headers["Cookie"] = "DedeUserID=" + DedeUserID + "; DedeUserID__ckMd5=" + DedeUserID__ckMd5 + "; SESSDATA=" + SESSDATA + "; bili_jct=" + bili_jct + "; buvid3=" + buvid3;
    var ret = await fetch.fetch({
        url: url,
        responseType: type,
        header: headers
    });
    return ret.data
}

export async function SendWbiGET(url, type, paramsobj){
    var headers = BILI_BASE_HEADERS;
    headers["Cookie"] = "DedeUserID=" + DedeUserID + "; DedeUserID__ckMd5=" + DedeUserID__ckMd5 + "; SESSDATA=" + SESSDATA + "; bili_jct=" + bili_jct + "; buvid3=" + buvid3;
    url = url + "?" + encWbi(paramsobj, wbi_img_key, wbi_sub_key)
    console.log("WbiGet URL: " + url)
    var ret = await fetch.fetch({
        url: url,
        responseType: type,
        header: headers
    });
    return ret.data.data
}

export async function SendBiliPOST(url, body, type){
    var headers = BILI_BASE_HEADERS;
    headers["Cookie"] = "DedeUserID=" + DedeUserID + "; DedeUserID__ckMd5=" + DedeUserID__ckMd5 + "; SESSDATA=" + SESSDATA + "; bili_jct=" + bili_jct + "; buvid3=" + buvid3;
    var ret = await fetch.fetch({
        url: url,
        responseType: type,
        header: headers,
        method: "POST",
        data: body
    });
    return ret.data.data
}

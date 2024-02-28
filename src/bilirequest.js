import fetch from '@system.fetch'
import file from '@system.file'
import router from '@system.router'
import prompt from '@system.prompt'

let Inited = false
let DedeUserID = null
let DedeUserID__ckMd5 = null
let SESSDATA = null
let bili_jct = null

const BILI_BASE_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
    "TE": "trailers",
    "Referer": "https://www.bilibili.com",
    "Origin": "https://www.bilibili.com",
    "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
    "Accept": "*/*"
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
    headers["Cookie"] = "DedeUserID=" + DedeUserID + "; DedeUserID__ckMd5=" + DedeUserID__ckMd5 + "; SESSDATA=" + SESSDATA + "; bili_jct=" + bili_jct;
    var ret = await fetch.fetch({
        url: url,
        responseType: type,
        header: headers
    });
    return ret.data.data
}

export async function SendBiliPOST(url, body, type){
    var headers = BILI_BASE_HEADERS;
    headers["Cookie"] = "DedeUserID=" + DedeUserID + "; DedeUserID__ckMd5=" + DedeUserID__ckMd5 + "; SESSDATA=" + SESSDATA + "; bili_jct=" + bili_jct;
    var ret = await fetch.fetch({
        url: url,
        responseType: type,
        header: headers,
        method: "POST",
        data: body
    });
    return ret.data.data
}
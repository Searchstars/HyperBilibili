import fetch from '@system.fetch'
import prompt from '@system.prompt'
import app from '@system.app'

export function CheckUpdates(){
    fetch.fetch({
        url: "https://gitee.com/search__stars/hb_ota_info/raw/master/current_ver",
        responseType: "text",
        success: (response) => {
            console.log(response)
            if(response != "" && response != void 0 && response != null){
                if(response.data != app.getInfo().versionName){
                    prompt.showToast({
                        message: "检查到版本更新：" + response.data + "，建议下载最新rpk并安装更新以获得更佳体验",
                        duration: 5000
                    })
                }
            }
            else{
                prompt.showToast({
                    message: "更新检查失败"
                })
            }
        }
    })
}
const date = new Date()

const tips = [
    "你所热爱的，就是你热爱的",
    "让我猜猜你现在使用的设备是...？",
    "澎湃哔哩不够澎湃怎么办？",
    "富哥V一点好不好，球球了",
    "有没有遇见将军大人Rechrd？",
    "关注永雏塔菲谢谢喵~",
    "关注孙笑川258谢谢喵~",
    "关注七海nanami谢谢喵~",
    "关注芽衣子OvO谢谢喵~",
    "关注嘉然今天吃什么谢谢喵~",
    "我觉得这是一种自信",
    "让我们保持忠！诚！",
    "雷军！金凡！",
    "Powered By Re:Bydour",
    "\"游戏不开挂不好玩。\"",
    "快去盯着易奥林做zeppbili。",
    "致敬一切奇迹的起点 @RX79XT_",
    "早上好中国，现在我有冰淇淋",
    "你这辈子就是被黑神话悟空害了。",
    "你他妈可别上课摸鱼。",
    "我是雷军，你们都给我去玩MIUI全防"
]

const AprilFoolsDayTips = [
    "您的设备已被Darock永久封禁",
    "澎湃哔哩即日起将停止开发与更新",
    "您的手表已被锁定，请支付BTC解锁",
    "Hacked By Dimples#1337"
]

export function getTips(): string{
    // 愚人节特供
    if(date.getMonth() === 3 && date.getDate() === 1){
        return AprilFoolsDayTips[Math.floor(Math.random() * AprilFoolsDayTips.length)]
    }
    return tips[Math.floor(Math.random() * tips.length)]
}
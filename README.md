# HyperBilibili （澎湃哔哩）
在Vela嵌入式设备上基于QuickApp实现的第三方B站客户端

## 使用
对于普通用户而非开发者，你只需要下载本应用的release版本（RPK文件）然后安装到你的设备上就行了。目前，我只会在米坛社区和Github上发布release版本，如果你想获得经过测试的稳定版本，请前往[米坛社区发布页](https://www.bandbbs.cn/threads/10200/)获取。如果你想紧跟代码提交的步伐，在手表上运行本项目最新且未经测试的不稳定开发版代码，请从本仓库的dist文件夹中直接下载rpk

## 搭建开发环境

克隆此仓库，然后在`Aiot IDE`中打开它，按照IDE的提示配置环境后就可以开始开发了

对于Aiot IDE的安装，推荐参阅：[https://www.projcora.club/OpenWearWiki/vela-developer-guide.html#preparing](https://www.projcora.club/OpenWearWiki/vela-developer-guide.html#preparing)

懒得看文档的直接从 https://kpan.mioffice.cn/webfolder/ext/iYJr4hwMLio （提取码RS85）下载对应你系统版本的Aiot-IDE就好了

***当然请一定要使用Ubuntu LTS系统，使用Windows和MacOS只会让你修问题修到头皮发麻，个人建议可以在Windows里开一个Hyper-V或VMware安装Ubuntu进行环境搭建***

## Hap链接接口
### 打开 澎湃哔哩
    只是用来打开程序罢了

    hap://app/com.searchstars.hyperbilibili/main
### 打开 澎湃哔哩 视频详情页
    带用户到视频详情页，然后用户可以查看视频的封面、标题、AI视频总结、评论区等内容，并且可以进行添加视频到收藏夹等操作

    hap://app/com.searchstars.hyperbilibili/videodetail?<params传参列表>

    传参列表:
        img_src 视频封面URL
        vid_title 视频标题文本
        bv 视频BV号
        cid 视频CID
        up_mid 视频UP主mid
        id 视频avid
        haplink 是否来自HAP链接（这个一定要设置true，除非澎湃哔哩在后台保活）

    本接口传参较多，但都是从B站的 获取视频详细信息 的接口获取的，应用程序开发者可以写一个函数，专门通过视频bv号获取这些信息，然后传过来。至于B站的接口从哪找，拉到这个README的最底下就知道了
### 打开 澎湃哔哩 AI视频总结页
    带用户到AI视频总结页，然后用户即可查看视频的AI视频总结。本接口相比视频详情页接口传参较少，但是留给用户的选择也较少，用户不能查看视频的标题和封面，也不能进行过多的操作，就只能看总结，因此不推荐使用

    hap://app/com.searchstars.hyperbilibili/videoaisummary?<params传参列表>

    传参列表：
        bv 视频BV号
        cid 视频CID
        up_mid 视频UP主mid
        haplink 是否来自HAP链接（这个一定要设置true，除非澎湃哔哩在后台保活）

    同上，本接口的所有除BV号外的参数都可以通过B站的 获取视频详细信息 的接口获取，拉到README最底下就能知道在哪找B站的API了

#### 使用HAP链接请务必保证传参正确，否则 澎湃哔哩 将无法正常工作。传参格式请参考HTTP URL FORMS格式，例如 `hap://app/.../...?key=value&you=myfriend&test=ok`
#### 为什么要提供这么多的参数？不能只提供一个BV号，获取更多信息的工作交给 澎湃哔哩 程序本身来进行吗？我的回答是NO，这些HAP接口也是 澎湃哔哩 程序内部所使用的接口，由于嵌入式设备的性能有限，我们需要减少使用fetch的数量，并且只传有用信息，如果再进行视频信息获取，对于澎湃哔哩而言是无用的多余操作，对于经过细致优化的调用HAP接口的第三方应用而言，也或许会是多余操作，我们不想进行额外的优化，也不清楚第三方开发者会如何开发和设计自己的程序，因此就干脆直接这么提供接口了

## 项目结构说明
根据Vela快应用项目的开发指南，本应用的结构将确定为单ux文件设计，即所有功能都写进单个ux文件中，包括template、js、css，一个ux文件代表一个功能模块，ux文件可被本项目中的其它ux文件使用，并且部分ux页面支持hap链接，以供第三方应用程序进行调用

单ux文件会难以维护？其实我个人认为还好，特别是对于这种 ***"还是API调用大佬"*** 的应用来说，一个Fetch，小参数一传，就都搞定了

项目Pages UX文件用途介绍：

    main：程序入口
    login：登录页面
    home：主页面
    myfolders：收藏夹列表
    networkerror：网络错误提示
    replydetail：评论详情
    settings：设置
    textshow：你可以理解为messagebox
    videoaisummary：视频AI总结 （开放HAP链接接口）
    videodetail：视频详情页 （开放HAP链接接口）
    videopush：视频首页推送页
    videoreplies：视频回复页

## 旧版模拟器运行注意事项
### 如果您在使用最新版本的Aiot-IDE，并将其附带的所有插件都已更新到最新版本（如果你能忍受最新版插件与IDE带来的各种Bug的话），且使用的模拟器镜像是最新版本，则可以忽略这些内容

模拟器和真机环境环境归根结底还是有所不同，部分功能的效果在模拟器和真机上的区别也不是可以忽略的，甚至可以直接影响到程序逻辑

因此，我们设置了一个叫`emu_mode`的变量，当它为true时，部分检测功能（如网络类型判定）会被禁用，只有这样，应用才能正常在模拟器下运行，否则将会产生误判导致出现异常。

所以，在使用模拟器开发的过程中，请到`src/app.ux`中的`script`标签下的`emu_mode`变量设置为true，***但是请千万不要忘记，打要装到真机上的rpk包时，请务必把它设置回false！***

## 开发文档

通过小米的[官方文档](https://iot.mi.com/vela/quickapp)熟悉和了解快应用。

## 声明
本项目与哔哩哔哩（Bilibili）官方无任何关联，包括但不限于 **哔哩哔哩股份有限公司** **上海幻电信息科技有限公司** **上海宽娱数码科技有限公司**

本项目所使用的所有API接口均来自[https://github.com/SocialSisterYi/bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect)，经过来自各界网友的测试与修正，本人未对哔哩哔哩（Bilibili）的任何客户端进行任何逆向工程（包括但不限于 反编译、反汇编、抓包、拆包）操作
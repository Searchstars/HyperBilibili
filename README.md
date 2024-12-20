# HyperBilibili （澎湃哔哩）
在Vela嵌入式设备上基于QuickApp实现的第三方B站客户端

## 子项目 / 分支:
1. 澎湃哔哩“米环版”：[https://github.com/OnDriveLine/HyperBilibili_Band](https://github.com/OnDriveLine/HyperBilibili_Band)
    - 专为 `小米手环9`（band9分支） `小米手环9 Pro`（MB9P分支） 等设备移植的澎湃哔哩客户端
    - MB9P分支基于v2.4版本修改，具有完整的功能并引入了部分v2.5版本的特性
    - band9分支基于v2.3版本修改，砍掉了绝大多数功能
    - band9分支默认启用interconnect联网，MB9P使用fetch


## 使用
对于普通用户而非开发者，你只需要下载本应用的release版本（RPK文件）然后安装到你的设备上就行了。目前，官方版本只会在官网发布，如果你想获得经过测试的稳定版本，请前往[官网](https://hyperbili.astralsight.space)获取。如果你想紧跟代码提交的步伐，在手表上运行本项目最新且未经测试的不稳定开发版代码，请从本仓库的actions中直接下载实时构建的rpk

`next-gen`分支的开发版本和release版本的包名不一样，因此事实上两个版本可以共存，可以分别登录不同的账号。
- 开发版包名：`com.searchstars.hyperbilibili.dev`
- release版包名：`com.searchstars.hyperbilibili`

## 搭建开发环境

克隆此仓库，然后在`Aiot IDE`中打开它

本项目不使用npm，而是使用yarn作为包管理器，因此你**不应该**按照IDE的引导去执行`npm i`，而是应该使用以下指令来安装项目依赖：

```bash
#安装yarn，对于debian系linux来说
sudo apt install yarn
#安装yarn，对于windows
winget install Yarn.Yarn

#在项目目录下执行以安装项目依赖
yarn
```

然后像普通快应用一样进行开发即可

## 开发文档

通过小米的[官方文档](https://iot.mi.com/vela/quickapp)熟悉和了解快应用。

## 声明
本项目与哔哩哔哩（Bilibili）官方无任何关联，包括但不限于 **哔哩哔哩股份有限公司** **上海幻电信息科技有限公司** **上海宽娱数码科技有限公司**

本项目所使用的所有API接口均来自[https://github.com/SocialSisterYi/bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect)，经过来自各界网友的测试与修正，本人未对哔哩哔哩（Bilibili）的任何客户端进行任何逆向工程（包括但不限于 反编译、反汇编、抓包、拆包）操作
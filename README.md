# HyperBilibili
在Vela嵌入式设备上基于QuickApp实现的第三方B站客户端

### 1. 开发

克隆此仓库，然后在`Aiot IDE`中打开它，按照IDE的提示配置环境后就可以开始开发了

对于Aiot IDE的安装，推荐参阅：[https://www.projcora.club/OpenWearWiki/vela-developer-guide.html#preparing](https://www.projcora.club/OpenWearWiki/vela-developer-guide.html#preparing)

### 2. 旧版模拟器运行注意事项
### 如果您在使用最新版本的Aiot-IDE，并将其附带的所有插件都已更新到最新版本，且使用的模拟器镜像是最新版本，则可以忽略这些内容

模拟器和真机环境环境归根结底还是有所不同，部分功能的效果在模拟器和真机上的区别也不是可以忽略的，甚至可以直接影响到程序逻辑

因此，我们设置了一个叫`emu_mode`的变量，当它为true时，部分检测功能（如网络类型判定）会被禁用，只有这样，应用才能正常在模拟器下运行，否则将会产生误判导致出现异常。

所以，在使用模拟器开发的过程中，请到`src/app.ux`中的`script`标签下的`emu_mode`变量设置为true，***但是请千万不要忘记，打要装到真机上的rpk包时，请务必把它设置回false！***

## 了解更多

你可以通过我们的[官方文档](https://iot.mi.com/vela/quickapp)熟悉和了解快应用。
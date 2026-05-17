// 应用顶层模块。
//
// AstroForge 0.0.10 会把 app 生命周期函数体按源码片段写入 app.js，但不会把
// shared 模块 import 一起打包进 Vela 运行时入口。这里保持顶层生命周期无副
// 作用，避免设备启动阶段引用未定义的 helper 导致直接退出。

export default {
  onCreate() {},
  onDestroy() {
    // 当前没有持久 socket 或后台任务；保留 hook 方便后续接入。
  },
};

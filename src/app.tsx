// AstroForge 应用级模块。
//
// `default export` 的对象会被前端提取为 IR 的 `app.lifecycle`，对应 Vela
// 厂商运行时 app.js 的 `$app_script$` 默认导出。常用 hook：`onCreate` /
// `onDestroy` / `onError` / `onPageNotFound`，按需添加。
export default {
  onCreate() {
    // 应用初始化时调用一次。可在此初始化全局状态或注册系统监听。
  },
};

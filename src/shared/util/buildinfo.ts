import data from "../../.buildinfo.json";

// gen-buildinfo.mjs 在构建前生成 src/.buildinfo.json；这里只做一次类型断言，
// 避免每个使用方都 import json 触发 IDE 警告。

export interface BuildInfo {
  versionName: string;
  versionCode: number;
  gitCommit: string;
  gitBranch: string;
  buildAt: string;
  isRelease: boolean;
}

export const buildinfo = data as BuildInfo;

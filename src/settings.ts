import { storage } from "./tsimports"

interface SettingsInterface {
  fresh_type: number;
  home_vid_count: number;
  article_split_dom_count: number;
  enableFullAnimation: boolean;

  // 下面的设置项将不在设置页面中展示
  agreedAllAgreements: boolean;
  
  // 校验字段
  _loadedSettings: boolean;
}

// 初始设置
export let SETTINGS: SettingsInterface = {
  fresh_type: 3, //视频推荐相关度，范围1-3，根据大数据推送
  home_vid_count: 10,
  // 专栏articleshow的每页dom节点裁切数量（单页最大dom数）
  article_split_dom_count: 9999,
  enableFullAnimation: false,

  agreedAllAgreements: false, // 是否已同意所有协议（用户协议 隐私协议 etc.）

  _loadedSettings: false
};

export function loadSettings(): void {
  storage.get({
    key: 'settings',
    success: function (data) {
      if (data) {
        const storedSettings = JSON.parse(data);
        SETTINGS = {
          ...SETTINGS,
          ...storedSettings
        };
      }
      global.logger.log('Settings loaded:', SETTINGS);
    },
    fail: function (data, code) {
      global.logger.log(`Failed to load settings, code = ${code}`);
    }
  });
}

export function saveSettings(params: Partial<SettingsInterface>): void {
  SETTINGS = {
    ...SETTINGS,
    ...params
  };
  storage.set({
    key: 'settings',
    value: JSON.stringify(SETTINGS),
    success: function () {
      global.logger.log('Settings saved successfully');
    },
    fail: function (data, code) {
      global.logger.log(`Failed to save settings, code = ${code}`);
    }
  });
}
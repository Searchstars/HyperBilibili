import { file } from "./tsimports";

// 定义文件存储的基本结构
interface StoredContent {
  id: string;
  title: string;
  type: string;
  fileUri: string;
}

// 模拟存储的内容列表
let storageIndex: StoredContent[] = [];

// 定义文件存储的基础路径
const baseUri = 'internal://files/bilisavedcontent/';
const indexFileUri = `${baseUri}index.json`; // 存储 storageIndex 的文件

// 封装 file 接口的 Promise 方法
function fileWrite(uri: string, data: string): Promise<void> {
  return new Promise((resolve, reject) => {
    file.writeText({
      uri,
      text: data,
      success: () => resolve(),
      fail: (data, code) => reject(`Failed to write to ${uri}: ${code}`)
    });
  });
}

function fileRead(uri: string): Promise<string> {
  return new Promise((resolve, reject) => {
    file.readText({
      uri,
      success: (data) => resolve(data.text),
      fail: (data, code) => reject(`Failed to read from ${uri}: ${code}`)
    });
  });
}

function fileList(dirUri: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    file.list({
      uri: dirUri,
      success: (data) => resolve(data.fileList),
      fail: (data, code) => reject(`Failed to list files in ${dirUri}: ${code}`)
    });
  });
}

function fileAccess(uri: string): Promise<boolean> {
  return new Promise((resolve) => {
    file.access({
      uri,
      success: () => resolve(true),
      fail: () => resolve(false)
    });
  });
}

function fileDelete(uri: string): Promise<void> {
  return new Promise((resolve, reject) => {
    file.delete({
      uri,
      success: () => resolve(),
      fail: (data, code) => reject(`Failed to delete ${uri}: ${code}`)
    });
  });
}

// 同步 storageIndex 到本地文件
async function saveStorageIndex(): Promise<void> {
  try {
    global.logger.log(storageIndex)
    const indexData = JSON.stringify(storageIndex);
    await fileWrite(indexFileUri, indexData);
  } catch (e) {
    global.logger.error(`[SavedContentManager] saveStorageIndex Error: ${e.toString()}`);
  }
}

// 从本地文件加载 storageIndex
async function loadStorageIndex(): Promise<void> {
  try {
    const fileExists = await fileAccess(indexFileUri);
    if (fileExists) {
      const indexData = await fileRead(indexFileUri);
      storageIndex = JSON.parse(indexData);
    } else {
      storageIndex = [];
    }
  } catch (e) {
    global.logger.error(`[SavedContentManager] loadStorageIndex Error: ${e.toString()}`);
    storageIndex = [];
  }
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export class SavedContentManager {
  // 初始化时加载 storageIndex
  static async initialize(): Promise<void> {
    await loadStorageIndex()
    global.logger.log("loaded SavedContent StorageIndex", storageIndex)
  }

  // 存储内容
  static async storeContent(title: string, data: string, type: string): Promise<string | void> {
    try {
      const id = generateUUID();
      const fileUri = `${baseUri}${id}.txt`;

      // 写入文件
      await fileWrite(fileUri, data);

      // 更新 storageIndex 并保存
      storageIndex.push({ id, title, type, fileUri });
      await saveStorageIndex();

      return id;
    } catch (e) {
      global.logger.error(`[SavedContentManager] storeContent Error: ${e.toString()}`);
    }
  }

  // 根据 id 或 title 读取内容
  static async getContent(identifier: string): Promise<string | null> {
    try {
      const content = storageIndex.find(item => item.id === identifier || item.title === identifier);
      if (!content) return null;

      // 读取文件内容
      const fileExists = await fileAccess(content.fileUri);
      if (!fileExists) throw new Error(`File does not exist: ${content.fileUri}`);

      return await fileRead(content.fileUri);
    } catch (e) {
      global.logger.error(`[SavedContentManager] getContent Error: ${e.toString()}`);
      return null;
    }
  }

  // 读取所有存储内容的 id 和 title 列表
  static async listAllContent(): Promise<any> {
    return storageIndex;
  }

  // 删除内容
  static async deleteContent(identifier: string): Promise<void> {
    try {
      const contentIndex = storageIndex.findIndex(item => item.id === identifier || item.title === identifier);
      if (contentIndex === -1) throw new Error('Content not found');

      // 删除文件
      const fileUri = storageIndex[contentIndex].fileUri;
      await fileDelete(fileUri);

      // 从 storageIndex 中删除记录并保存
      storageIndex.splice(contentIndex, 1);
      await saveStorageIndex();
    } catch (e) {
      global.logger.error(`[SavedContentManager] deleteContent Error: ${e.toString()}`);
    }
  }
}
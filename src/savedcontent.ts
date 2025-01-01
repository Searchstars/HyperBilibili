import { asyncFile } from "./asyncapi/file";

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

// 同步 storageIndex 到本地文件
async function saveStorageIndex(): Promise<void> {
  try {
    global.logger.log(storageIndex)
    const indexData = JSON.stringify(storageIndex);
    await asyncFile.writeText({
      uri: indexFileUri,
      text: indexData
    });
  } catch (e) {
    global.logger.error(`[SavedContentManager] saveStorageIndex Error: ${e.toString()}`);
  }
}

// 从本地文件加载 storageIndex
async function loadStorageIndex(): Promise<void> {
  try {
    const fileExists = await asyncFile.access({ uri: indexFileUri });
    if (fileExists) {
      const indexData = await asyncFile.readText({ uri: indexFileUri });
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
      await asyncFile.writeText({ uri: fileUri, text: data });

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
      const fileExists = await asyncFile.access({ uri: content.fileUri });
      if (!fileExists) throw new Error(`File does not exist: ${content.fileUri}`);

      return await asyncFile.readText({ uri: content.fileUri });
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
      await asyncFile.delete({ uri: fileUri });

      // 从 storageIndex 中删除记录并保存
      storageIndex.splice(contentIndex, 1);
      await saveStorageIndex();
    } catch (e) {
      global.logger.error(`[SavedContentManager] deleteContent Error: ${e.toString()}`);
    }
  }
}
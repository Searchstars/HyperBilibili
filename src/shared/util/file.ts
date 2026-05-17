import { file } from "@astralsight/astroforge-core";

// 与 storage.ts 同源动机：把 system.file 回调封装为 Promise，避免每个调用点
// 都手写 success/fail。仅暴露当前业务用到的几个动作，按需扩展。

export interface FileEntry {
  uri: string;
  length: number;
  lastModifiedTime: number;
  type?: string;
}

export async function fileMkdir(uri: string, recursive = true): Promise<void> {
  return new Promise((resolve, reject) => {
    (file as any).mkdir({
      uri,
      recursive,
      success: () => resolve(),
      fail: (_: unknown, code: number) => reject(new Error(`mkdir code=${code}`)),
    });
  });
}

export async function fileList(uri: string): Promise<FileEntry[]> {
  return new Promise((resolve, reject) => {
    (file as any).list({
      uri,
      success: (data: { fileList: FileEntry[] }) => resolve(data.fileList ?? []),
      fail: (_: unknown, code: number) => reject(new Error(`list code=${code}`)),
    });
  });
}

export async function fileExists(uri: string): Promise<boolean> {
  return new Promise((resolve) => {
    (file as any).access({
      uri,
      success: () => resolve(true),
      fail: () => resolve(false),
    });
  });
}

export async function fileReadText(uri: string): Promise<string> {
  return new Promise((resolve, reject) => {
    (file as any).readText({
      uri,
      success: (data: { text: string }) => resolve(data.text),
      fail: (_: unknown, code: number) => reject(new Error(`readText code=${code}`)),
    });
  });
}

export async function fileWriteText(uri: string, text: string, append = false): Promise<void> {
  return new Promise((resolve, reject) => {
    (file as any).writeText({
      uri,
      text,
      append,
      success: () => resolve(),
      fail: (_: unknown, code: number) => reject(new Error(`writeText code=${code}`)),
    });
  });
}

export async function fileDelete(uri: string): Promise<void> {
  return new Promise((resolve) => {
    (file as any).delete({
      uri,
      success: () => resolve(),
      fail: () => resolve(),
    });
  });
}

export async function fileRmdir(uri: string, recursive = true): Promise<void> {
  return new Promise((resolve) => {
    (file as any).rmdir({
      uri,
      recursive,
      success: () => resolve(),
      fail: () => resolve(),
    });
  });
}

import { file } from '../tsimports'

interface FileMoveOptions {
    srcUri: string;
    dstUri: string;
}

interface FileCopyOptions {
    srcUri: string;
    dstUri: string;
}

interface FileListOptions {
    uri: string;
}

interface FileGetOptions {
    uri: string;
    recursive?: boolean;
}

interface FileDeleteOptions {
    uri: string;
}

interface FileWriteTextOptions {
    uri: string;
    text: string;
    encoding?: string;
    append?: boolean;
}

interface FileWriteArrayBufferOptions {
    uri: string;
    buffer: Uint8Array;
    position?: number;
    append?: boolean;
}

interface FileReadTextOptions {
    uri: string;
    encoding?: string;
}

interface FileReadArrayBufferOptions {
    uri: string;
    position?: number;
    length?: number;
}

interface FileAccessOptions {
    uri: string;
}

interface FileMkdirOptions {
    uri: string;
    recursive?: boolean;
}

interface FileRmdirOptions {
    uri: string;
    recursive?: boolean;
}

class FileAPI {
    async move(options: FileMoveOptions): Promise<string> {
        return new Promise((resolve, reject) => {
            file.move({
                ...options,
                success: (uri: string) => resolve(uri),
                fail: (_, code: number) => reject(new Error(`Move failed with code ${code}`)),
            });
        });
    }

    async copy(options: FileCopyOptions): Promise<string> {
        return new Promise((resolve, reject) => {
            file.copy({
                ...options,
                success: (uri: string) => resolve(uri),
                fail: (_, code: number) => reject(new Error(`Copy failed with code ${code}`)),
            });
        });
    }

    async list(options: FileListOptions): Promise<{ fileList: { uri: string; lastModifiedTime: number; length: number }[] }> {
        return new Promise((resolve, reject) => {
            file.list({
                ...options,
                success: (data: { fileList: { uri: string; lastModifiedTime: number; length: number }[] }) => resolve(data),
                fail: (_, code: number) => reject(new Error(`List failed with code ${code}`)),
            });
        });
    }

    async get(options: FileGetOptions): Promise<{ uri: string; length: number; lastModifiedTime: number; type: string; subFiles?: any[] }> {
        return new Promise((resolve, reject) => {
            file.get({
                ...options,
                success: (data: any) => resolve(data),
                fail: (_, code: number) => reject(new Error(`Get failed with code ${code}`)),
            });
        });
    }

    async delete(options: FileDeleteOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            file.delete({
                ...options,
                success: () => resolve(),
                fail: (_, code: number) => reject(new Error(`Delete failed with code ${code}`)),
            });
        });
    }

    async writeText(options: FileWriteTextOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            file.writeText({
                ...options,
                success: () => resolve(),
                fail: (_, code: number) => reject(new Error(`WriteText failed with code ${code}`)),
            });
        });
    }

    async writeArrayBuffer(options: FileWriteArrayBufferOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            file.writeArrayBuffer({
                ...options,
                success: () => resolve(),
                fail: (_, code: number) => reject(new Error(`WriteArrayBuffer failed with code ${code}`)),
            });
        });
    }

    async readText(options: FileReadTextOptions): Promise<string> {
        return new Promise((resolve, reject) => {
            file.readText({
                ...options,
                success: (data: { text: string }) => resolve(data.text),
                fail: (_, code: number) => reject(new Error(`ReadText failed with code ${code}`)),
            });
        });
    }

    async readArrayBuffer(options: FileReadArrayBufferOptions): Promise<Uint8Array> {
        return new Promise((resolve, reject) => {
            file.readArrayBuffer({
                ...options,
                success: (data: { buffer: Uint8Array }) => resolve(data.buffer),
                fail: (_, code: number) => reject(new Error(`ReadArrayBuffer failed with code ${code}`)),
            });
        });
    }

    async access(options: FileAccessOptions): Promise<boolean> {
        return new Promise((resolve, reject) => {
            file.access({
                ...options,
                success: () => resolve(true),
                fail: (_, code: number) => reject(new Error(`Access failed with code ${code}`)),
            });
        });
    }

    async mkdir(options: FileMkdirOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            file.mkdir({
                ...options,
                success: () => resolve(),
                fail: (_, code: number) => reject(new Error(`Mkdir failed with code ${code}`)),
            });
        });
    }

    async rmdir(options: FileRmdirOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            file.rmdir({
                ...options,
                success: () => resolve(),
                fail: (_, code: number) => reject(new Error(`Rmdir failed with code ${code}`)),
            });
        });
    }
}

export const asyncFile = new FileAPI();
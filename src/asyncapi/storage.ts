import { storage } from "../tsimports";

interface StorageGetOptions {
    key: string;
    default?: string;
}

interface StorageSetOptions {
    key: string;
    value: string;
}

interface StorageDeleteOptions {
    key: string;
}

class StorageAPI {
    async get(options: StorageGetOptions): Promise<string> {
        return new Promise((resolve, reject) => {
            storage.get({
                ...options,
                success: (data: string) => resolve(data),
                fail: (_, code: number) => reject(new Error(`Get failed with code ${code}`)),
            });
        });
    }

    async set(options: StorageSetOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            storage.set({
                ...options,
                success: () => resolve(),
                fail: (_, code: number) => reject(new Error(`Set failed with code ${code}`)),
            });
        });
    }

    async clear(): Promise<void> {
        return new Promise((resolve, reject) => {
            storage.clear({
                success: () => resolve(),
                fail: (_, code: number) => reject(new Error(`Clear failed with code ${code}`)),
            });
        });
    }

    async delete(options: StorageDeleteOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            storage.delete({
                ...options,
                success: () => resolve(),
                fail: (_, code: number) => reject(new Error(`Delete failed with code ${code}`)),
            });
        });
    }
}

export const asyncStorage = new StorageAPI();
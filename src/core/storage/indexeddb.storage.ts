import {StorageProvider} from "./index";

export class IndexedDBStorageProvider implements StorageProvider {
    private readonly database: IDBDatabase;

    constructor(database: IDBDatabase) {
        this.database = database;
    }

    public static async Init(): Promise<IndexedDBStorageProvider> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(".storage", 3);
            request.onupgradeneeded = (event) => {
                request.result
                    .createObjectStore("data", {keyPath: 'key'})
                    .createIndex("value", "value", {unique: false});

            };
            request.onerror = reject;
            request.onblocked = reject;
            request.onsuccess = () => resolve(new IndexedDBStorageProvider(request.result));
        });
    }

    private static async IDBRequestPromisify<T>(request: IDBRequest<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            request.onerror = reject
            request.onsuccess = () => resolve(request.result) // Or (event) => resolve((event.target as any).result)
        });
    }

    public async set(key: string, value: Uint8Array | undefined): Promise<void> {
        if (value)
            await IndexedDBStorageProvider.IDBRequestPromisify(this.database.transaction("data", "readwrite").objectStore("data").put({
                key,
                value: value.buffer
            }));
        else
            await IndexedDBStorageProvider.IDBRequestPromisify(this.database.transaction("data", "readwrite").objectStore("data").delete(key));
    }

    public async has(key: string): Promise<boolean> {
        return await IndexedDBStorageProvider.IDBRequestPromisify(this.database.transaction("data", "readonly").objectStore("data").count(key)) > 0;
    }

    public async get(key: string): Promise<Uint8Array | undefined> {
        return new Uint8Array((await IndexedDBStorageProvider.IDBRequestPromisify(this.database.transaction("data", "readonly").objectStore("data").get(key))).value);
    }

    public async ls(): Promise<string[]> {
        return await IndexedDBStorageProvider.IDBRequestPromisify(this.database.transaction("data", "readonly").objectStore("data").getAllKeys()) as string[];
    }

    //For better stream support add cursor
}

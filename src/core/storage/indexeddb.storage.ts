import {StorageProvider} from "./";

export class IndexedDBStorageProvider implements StorageProvider {
    private readonly database: IDBDatabase;
    private readonly basePath: string;

    constructor(database: IDBDatabase, basePath: string) {
        this.database = database;
        this.basePath = basePath;
    }

    public static async Init(basePath: string = ".storage/"): Promise<IndexedDBStorageProvider> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(basePath, 3);
            request.onupgradeneeded = (event) => {
                if (!request.result.objectStoreNames.contains(basePath)) {
                    request.result
                        //.createObjectStore(basePath)
                        .createObjectStore(basePath, {keyPath: 'key'})
                        .createIndex("keyIndex", "key");
                    //.createObjectStore(basePath, {keyPath: 'key'})
                    //.createIndex("value", "value", {unique: false});
                }
            };
            request.onerror = () => reject(new Error("Failed to open the IndexedDB"));
            request.onblocked = () => reject(new Error("Blocked to open the IndexedDB"));
            request.onsuccess = () => resolve(new IndexedDBStorageProvider(request.result, basePath));
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
            await IndexedDBStorageProvider.IDBRequestPromisify(this.database.transaction(this.basePath, "readwrite").objectStore(this.basePath).put({
                key,
                value: value.buffer
            }));
        else
            await IndexedDBStorageProvider.IDBRequestPromisify(this.database.transaction(this.basePath, "readwrite").objectStore(this.basePath).delete(key));
    }

    public async has(key: string): Promise<boolean> {
        return await IndexedDBStorageProvider.IDBRequestPromisify(this.database.transaction(this.basePath, "readonly").objectStore(this.basePath).count(key)) > 0;
    }

    public async get(key: string): Promise<Uint8Array | undefined> {
        // Really slow when sequential get, maybe need to implement getMany
        const res = await IndexedDBStorageProvider.IDBRequestPromisify(this.database.transaction(this.basePath, "readonly").objectStore(this.basePath).get(key));
        return res ? new Uint8Array(res.value) : undefined;
    }

    public async ls(): Promise<string[]> {
        return await IndexedDBStorageProvider.IDBRequestPromisify(this.database.transaction(this.basePath, "readonly").objectStore(this.basePath).getAllKeys()) as string[];
    }

    public async clear(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.database.close();
            const request = indexedDB.deleteDatabase(this.database.name);

            request.onerror = () => reject(new Error("Failed to delete the database"));
            request.onsuccess = () => resolve();
        });
    }

    // For better stream support add cursor
}

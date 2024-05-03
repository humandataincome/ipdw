export interface StorageProvider {
    set(key: string, value: Uint8Array | undefined): Promise<void>;

    has(key: string): Promise<boolean>;

    get(key: string): Promise<Uint8Array | undefined>;

    ls(): Promise<string[]>;

    clear(): Promise<void>
}

export * from "./memory.storage"
export * from "./filesystem.storage"
export * from "./indexeddb.storage"

export * from "./stream.provider"

// See docs:
// MemoryStorageProvider is the transient implementation for both Node and Browser;
// FileSystemStorageProvider is the persistent implementation for Node;
// IndexedDBStorageProvider is the persistent implementation for Browser;

// Most of the time just use this
// typeof window === 'object' || typeof importScripts === 'function' ? await IndexedDBStorageProvider.Init(basePath) : new FileSystemStorageProvider(basePath)

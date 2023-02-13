import {Buffer} from "buffer";

//TODO: ADD STREAM SUPPORT
export interface StorageProvider {
    set(key: string, value: Buffer): Promise<void>;

    has(key: string): Promise<boolean>;

    get(key: string): Promise<Buffer | undefined>;

    ls(): Promise<string[]>;
}

export * from "./memory.storage"
export * from "./filesystem.storage"
export * from "./indexeddb.storage"

// See docs:
// MemoryStorageProvider is the transient implementation for both Node and Browser
// FileSystemStorageProvider is the persistent implementation for Node;
// IndexedDBStorageProvider is the persistent implementation for Browser;

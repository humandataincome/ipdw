import {StorageProvider} from "./";

export class MemoryStorageProvider implements StorageProvider {
    private storage: Map<string, Uint8Array>;

    constructor() {
        this.storage = new Map<string, Uint8Array>();
    }

    public async set(key: string, value: Uint8Array | undefined): Promise<void> {
        if (value)
            this.storage.set(key, new Uint8Array(value));
        else
            this.storage.delete(key);
    }

    public async has(key: string): Promise<boolean> {
        return this.storage.has(key);
    }

    public async get(key: string): Promise<Uint8Array | undefined> {
        return this.storage.get(key);
    }

    public async ls(): Promise<string[]> {
        return Array.from(this.storage.keys());
    }

    public async clear(): Promise<void> {
        return this.storage.clear();
    }
}

// See docs:
// FileSystemStorageProvider is the implementation for Node;
// IndexedDBStorageProvider is the implementation for Browser;

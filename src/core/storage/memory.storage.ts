import {StorageProvider} from "./index";

export class MemoryStorageProvider implements StorageProvider {
    private storage: Map<string, Uint8Array>;

    constructor() {
        this.storage = new Map<string, Uint8Array>();
    }

    public async set(key: string, value: Uint8Array | undefined): Promise<void> {
        if (value)
            this.storage.set(key, value);
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
}

// See docs:
// FileSystemStorageProvider is the implementation for Node;
// IndexedDBStorageProvider is the implementation for Browser;

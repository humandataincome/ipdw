import {StorageProvider} from "../storage";
import crypto from "crypto";

interface CacheMetadata {
    lastModified: number;
    hash: string;
}

// This is a conflict free version of Cached. It uses Last-Write-Wins
export class CRDTStorageOverlay implements StorageProvider {
    private remoteStorage: StorageProvider;
    private cacheStorage: StorageProvider;
    private cacheMetadata: Map<string, CacheMetadata>;
    private readonly syncInterval = 30 * 1000;
    private syncIntervalId: NodeJS.Timeout | null = null;

    constructor(remoteStorage: StorageProvider, cacheStorage: StorageProvider, startSync: boolean = true) {
        this.remoteStorage = remoteStorage;
        this.cacheStorage = cacheStorage;
        this.cacheMetadata = new Map();
        if (startSync)
            this.startSync();
    }

    async set(key: string, value: Uint8Array | undefined): Promise<void> {
        const timestamp = Date.now();
        await this.remoteStorage.set(key, value ? this.wrapWithTimestamp(value, timestamp) : undefined);
        if (value) {
            await this.cacheStorage.set(key, value);
            await this.updateCacheMetadata(key, value, timestamp);
        } else {
            await this.cacheStorage.set(key, undefined);
            this.cacheMetadata.delete(key);
            await this.saveCacheMetadata();
        }
    }

    async has(key: string): Promise<boolean> {
        const inCache = await this.cacheStorage.has(key);
        if (inCache) return true;
        return this.remoteStorage.has(key);
    }

    async get(key: string): Promise<Uint8Array | undefined> {
        const cachedValue = await this.cacheStorage.get(key);
        if (cachedValue) return cachedValue;

        const remoteValueWrapped = await this.remoteStorage.get(key);
        if (remoteValueWrapped) {
            const {value: remoteValue, timestamp: remoteTimestamp} = this.unwrapWithTimestamp(remoteValueWrapped);
            await this.cacheStorage.set(key, remoteValue);
            await this.updateCacheMetadata(key, remoteValue, remoteTimestamp);
        }
        return remoteValueWrapped ? this.unwrapWithTimestamp(remoteValueWrapped).value : undefined;
    }

    async ls(): Promise<string[]> {
        return this.remoteStorage.ls();
    }

    async clear(): Promise<void> {
        await this.remoteStorage.clear();
        await this.cacheStorage.clear();
        this.cacheMetadata.clear();
        await this.saveCacheMetadata();
    }

    public startSync(): void {
        if (!this.syncIntervalId) {
            this.syncIntervalId = setInterval(() => this.sync(), this.syncInterval);
        }
    }

    public stopSync(): void {
        if (this.syncIntervalId) {
            clearInterval(this.syncIntervalId);
            this.syncIntervalId = null;
        }
    }

    async sync(): Promise<void> {
        await this.loadCacheMetadata();

        const remoteKeys = await this.remoteStorage.ls();
        const localKeys = await this.cacheStorage.ls();

        // Handle deletions
        for (const localKey of localKeys) {
            if (!remoteKeys.includes(localKey) && localKey !== '__cache__') {
                await this.cacheStorage.set(localKey, undefined);
                this.cacheMetadata.delete(localKey);
            }
        }

        // Handle updates and additions
        for (const remoteKey of remoteKeys) {
            const remoteValueWrapped = await this.remoteStorage.get(remoteKey);
            if (!remoteValueWrapped) continue;

            const {value: remoteValue, timestamp: remoteTimestamp} = this.unwrapWithTimestamp(remoteValueWrapped);
            const localMetadata = this.cacheMetadata.get(remoteKey);

            if (!localMetadata || localMetadata.lastModified < remoteTimestamp) {
                await this.cacheStorage.set(remoteKey, remoteValue);
                await this.updateCacheMetadata(remoteKey, remoteValue, remoteTimestamp);
            }
        }

        await this.saveCacheMetadata();
    }

    private async loadCacheMetadata(): Promise<void> {
        const metadataJson = await this.cacheStorage.get('__cache__');
        if (metadataJson) {
            this.cacheMetadata = new Map(JSON.parse(new TextDecoder().decode(metadataJson)));
        }
    }

    private async saveCacheMetadata(): Promise<void> {
        const metadataJson = JSON.stringify(Array.from(this.cacheMetadata.entries()));
        await this.cacheStorage.set('__cache__', new TextEncoder().encode(metadataJson));
    }

    private async updateCacheMetadata(key: string, value: Uint8Array, timestamp: number): Promise<void> {
        const hash = await this.computeHash(value);
        this.cacheMetadata.set(key, {
            lastModified: timestamp,
            hash
        });
        await this.saveCacheMetadata();
    }

    private async computeHash(data: Uint8Array): Promise<string> {
        return Buffer.from(crypto.createHash('sha256').update(data).digest()).toString('base64');
    }

    private wrapWithTimestamp(value: Uint8Array, timestamp: number): Uint8Array {
        const timestampBuffer = new ArrayBuffer(8);
        new DataView(timestampBuffer).setUint32(0, Math.floor(timestamp / 2 ** 32));
        new DataView(timestampBuffer).setUint32(4, timestamp % 2 ** 32);
        const wrappedValue = new Uint8Array(8 + value.length);
        wrappedValue.set(new Uint8Array(timestampBuffer), 0);
        wrappedValue.set(value, 8);
        return wrappedValue;
    }

    private unwrapWithTimestamp(wrappedValue: Uint8Array): { value: Uint8Array, timestamp: number } {
        const timestampBuffer = wrappedValue.slice(0, 8);
        const timestamp = new DataView(timestampBuffer.buffer).getUint32(0) * 2 ** 32 + new DataView(timestampBuffer.buffer).getUint32(4);
        const value = wrappedValue.slice(8);
        return {value, timestamp};
    }
}

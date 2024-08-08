import {StorageProvider} from "../storage";
import crypto from "crypto";

interface CacheMetadata {
    lastModified: number;
    hash: string;
}

export class CachedStorageOverlay<RemoteStorageProviderT extends StorageProvider, CacheStorageProviderT extends StorageProvider> implements StorageProvider {
    private remoteStorage: RemoteStorageProviderT;
    private cacheStorage: CacheStorageProviderT;
    private cacheMetadata: Map<string, CacheMetadata>;
    private readonly syncInterval = 30 * 1000;
    private syncIntervalId: NodeJS.Timeout | null = null;

    constructor(remoteStorage: RemoteStorageProviderT, cacheStorage: CacheStorageProviderT, startSync: boolean = true) {
        this.remoteStorage = remoteStorage;
        this.cacheStorage = cacheStorage;
        this.cacheMetadata = new Map();
        if (startSync)
            this.startSync();
    }

    async set(key: string, value: Uint8Array | undefined): Promise<void> {
        await this.remoteStorage.set(key, value);
        if (value) {
            await this.cacheStorage.set(key, value);
            await this.updateCacheMetadata(key, value);
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

        const remoteValue = await this.remoteStorage.get(key);
        if (remoteValue) {
            await this.cacheStorage.set(key, remoteValue);
            await this.updateCacheMetadata(key, remoteValue);
        }
        return remoteValue;
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
            const remoteValue = await this.remoteStorage.get(remoteKey);
            if (!remoteValue) continue;

            const localMetadata = this.cacheMetadata.get(remoteKey);
            const remoteHash = await this.computeHash(remoteValue);

            if (!localMetadata || localMetadata.hash !== remoteHash) {
                await this.cacheStorage.set(remoteKey, remoteValue);
                await this.updateCacheMetadata(remoteKey, remoteValue);
            }
        }

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

    private async updateCacheMetadata(key: string, value: Uint8Array): Promise<void> {
        const hash = await this.computeHash(value);
        this.cacheMetadata.set(key, {
            lastModified: Date.now(),
            hash
        });
        await this.saveCacheMetadata();
    }

    private async computeHash(data: Uint8Array): Promise<string> {
        return Buffer.from(crypto.createHash('sha256').update(data).digest()).toString('base64');
    }
}

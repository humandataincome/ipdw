import {MemoryStorageProvider, StorageProvider} from "../storage";

export class CompressedStorageOverlay<CompressedStorageProviderT extends StorageProvider, UncompressedStorageProviderT extends StorageProvider> implements StorageProvider {
    private compressedStorageProvider: CompressedStorageProviderT;
    private uncompressedStorageProvider: UncompressedStorageProviderT;

    constructor(compressedStorageProvider: CompressedStorageProviderT, uncompressedStorageProvider: UncompressedStorageProviderT) {
        this.compressedStorageProvider = compressedStorageProvider;
        this.uncompressedStorageProvider = uncompressedStorageProvider;
    }

    public static async Init<CompressedStorageProviderT extends StorageProvider>(storageProvider: CompressedStorageProviderT): Promise<CompressedStorageOverlay<CompressedStorageProviderT, MemoryStorageProvider>> {
        const compressed = await storageProvider.get('__compressed__');
        const uncompressedStorageProvider = new MemoryStorageProvider();

        if (compressed) {
            const compressedString = Buffer.from(compressed).toString('utf-8');
            const uncompressedData = JSON.parse(compressedString);
            for (const [key, value] of Object.entries(uncompressedData)) {
                if (typeof value === 'string') {
                    await uncompressedStorageProvider.set(key, Buffer.from(value, 'base64'));
                }
            }
        }

        return new CompressedStorageOverlay(storageProvider, uncompressedStorageProvider);
    }

    public async set(key: string, value: Uint8Array | undefined): Promise<void> {
        await this.uncompressedStorageProvider.set(key, value);
        await this.updateCompressedStorage();
    }

    public async has(key: string): Promise<boolean> {
        return this.uncompressedStorageProvider.has(key);
    }

    public async get(key: string): Promise<Uint8Array | undefined> {
        return this.uncompressedStorageProvider.get(key);
    }

    public async ls(): Promise<string[]> {
        return this.uncompressedStorageProvider.ls();
    }

    public async clear(): Promise<void> {
        await this.uncompressedStorageProvider.clear();
        await this.compressedStorageProvider.clear();
    }

    public async toBuffer(): Promise<Buffer> {
        const data: Record<string, string> = {};
        const keys = await this.ls();
        for (const key of keys) {
            const value = await this.get(key);
            if (value) {
                data[key] = Buffer.from(value).toString('base64');
            }
        }
        const jsonString = JSON.stringify(data);
        return Buffer.from(jsonString);
    }

    private async updateCompressedStorage(): Promise<void> {
        const compressedData = await this.toBuffer();
        await this.compressedStorageProvider.set('__compressed__', new Uint8Array(compressedData));
    }
}

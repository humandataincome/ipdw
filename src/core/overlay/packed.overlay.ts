import {StorageProvider} from "../storage";

import {PackFactory} from "../pack";

export class PackedStorageOverlay implements StorageProvider {
    private storageProvider: StorageProvider;
    private keyPackFactory: PackFactory;
    private valuePackFactory: PackFactory;

    constructor(storageProvider: StorageProvider, keyPackFactory: PackFactory, valuePackFactory: PackFactory) {
        this.storageProvider = storageProvider;
        this.keyPackFactory = keyPackFactory;
        this.valuePackFactory = valuePackFactory;
    }

    public async set(key: string, value: Uint8Array | undefined): Promise<void> {
        const keyPack = await this.keyPackFactory.encode(Buffer.from(key, 'utf8'));
        const keyPackString = Buffer.from(keyPack).toBase62();
        const valuePack = value ? await this.valuePackFactory.encode(value) : undefined;

        return this.storageProvider.set(keyPackString, valuePack);
    }

    public async has(key: string): Promise<boolean> {
        const keyPack = await this.keyPackFactory.encode(Buffer.from(key, 'utf8'));
        const keyPackString = Buffer.from(keyPack).toBase62();

        return this.storageProvider.has(keyPackString);
    }

    public async get(key: string): Promise<Uint8Array | undefined> {
        const keyPack = await this.keyPackFactory.encode(Buffer.from(key, 'utf8'));
        const keyPackString = Buffer.from(keyPack).toBase62();
        const valuePack = await this.storageProvider.get(keyPackString);

        return valuePack ? this.valuePackFactory.decode(valuePack) : undefined;
    }

    public async ls(): Promise<string[]> {
        const keyPacks = await this.storageProvider.ls();

        return Promise.all(keyPacks.map(async kps => {
            const keyBuffer = await this.keyPackFactory.decode(Buffer.fromBase62(kps));
            return Buffer.from(keyBuffer!).toString('utf8');
        }));
    }

    public async clear(): Promise<void> {
        return this.storageProvider.clear();
    }
}

import {StorageProvider} from "./";
import * as Y from "yjs";
import {Libp2pFactory, SynchronizationProvider} from "../network";
import {ArrayUtils} from "../../utils";

export class IPDWStorageProvider implements StorageProvider {
    public readonly synchronizationProvider: SynchronizationProvider;
    private readonly yMap: Y.Map<Uint8Array>;
    private readonly storageProvider: StorageProvider

    constructor(yMap: Y.Map<Uint8Array>, synchronizationProvider: SynchronizationProvider, storageProvider: StorageProvider) {
        this.yMap = yMap;
        this.synchronizationProvider = synchronizationProvider;
        this.storageProvider = storageProvider;
    }

    public static async Init(privateKey: string, storageProvider: StorageProvider): Promise<IPDWStorageProvider> {
        const crdtDoc = new Y.Doc();
        const crdtMap = crdtDoc.getMap<Uint8Array>('storage');

        const keys = await storageProvider.ls();

        for (const key of keys) {
            const value = await storageProvider.get(key);
            if (value !== undefined) {
                crdtMap.set(key, new Uint8Array(value));
            }
        }

        crdtMap.observe((event: Y.YMapEvent<Uint8Array>) => {
            event.changes.keys.forEach(async (change, key) => {
                if (change.action === 'add' || change.action === 'update') {
                    const value = crdtMap.get(key);
                    if (value !== undefined) {
                        if (!ArrayUtils.Uint8ArrayEquals((await storageProvider.get(key)) ?? new Uint8Array(), value))
                            await storageProvider.set(key, value);
                    }
                } else if (change.action === 'delete') {
                    if (await storageProvider.has(key))
                        await storageProvider.set(key, undefined);
                }
            });
        });

        const node = await Libp2pFactory.create();
        const synchronizationProvider = await SynchronizationProvider.Init(node, crdtDoc, privateKey);

        await synchronizationProvider.start();

        return new IPDWStorageProvider(crdtMap, synchronizationProvider, storageProvider);
    }

    public async set(key: string, value: Uint8Array | undefined): Promise<void> {
        await this.storageProvider.set(key, value);

        if (!value) {
            this.yMap.delete(key);
        } else {
            this.yMap.set(key, new Uint8Array(value));
        }
    }

    public async has(key: string): Promise<boolean> {
        return this.yMap.has(key);
    }

    public async get(key: string): Promise<Uint8Array | undefined> {
        return this.yMap.get(key);
    }

    public async ls(): Promise<string[]> {
        return Array.from(this.yMap.keys());
    }

    public async clear(): Promise<void> {
        await this.storageProvider.clear();
        this.yMap.clear();
    }
}

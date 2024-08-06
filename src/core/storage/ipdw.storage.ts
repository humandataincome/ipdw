import {StorageProvider} from "./";
import * as Y from "yjs";
import {Libp2pFactory, SynchronizationProvider} from "../network";

export class IPDWStorageProvider implements StorageProvider {
    public readonly synchronizationProvider: SynchronizationProvider;
    private readonly yMap: Y.Map<Uint8Array>;

    constructor(yMap: Y.Map<Uint8Array>, synchronizationProvider: SynchronizationProvider) {
        this.yMap = yMap;
        this.synchronizationProvider = synchronizationProvider;
    }

    public static async Init(privateKey: string, storageProvider: StorageProvider): Promise<IPDWStorageProvider> {
        const crdtDoc = new Y.Doc();
        const crdtMap = crdtDoc.getMap<Uint8Array>('storage');

        const keys = await storageProvider.ls();

        for (const key of keys) {
            const value = await storageProvider.get(key);
            if (value !== undefined) {
                crdtMap.set(key, value);
            }
        }

        crdtMap.observe((event: Y.YMapEvent<Uint8Array>) => {
            event.changes.keys.forEach((change, key) => {
                if (change.action === 'add' || change.action === 'update') {
                    const value = crdtMap.get(key);
                    if (value !== undefined) {
                        storageProvider.set(key, value);
                    }
                } else if (change.action === 'delete') {
                    storageProvider.set(key, undefined);
                }
            });
        });

        const node = await Libp2pFactory.create();
        const synchronizationProvider = await SynchronizationProvider.Init(node, crdtDoc, privateKey);

        return new IPDWStorageProvider(crdtMap, synchronizationProvider);
    }

    public async set(key: string, value: Uint8Array | undefined): Promise<void> {
        if (value === undefined) {
            this.yMap.delete(key);
        } else {
            this.yMap.set(key, value);
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
        this.yMap.clear();
    }
}

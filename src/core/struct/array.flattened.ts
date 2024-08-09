import {StorageProvider} from "../storage";
import {FlattenedMap} from "./";

export class FlattenedArray<StorageProviderT extends StorageProvider> {
    private readonly storage: StorageProviderT;
    private readonly prefix: string;

    constructor(storage: StorageProviderT, prefix: string = '') {
        this.storage = storage;
        this.prefix = prefix;
    }

    public async get(index: number): Promise<string | FlattenedMap<StorageProviderT> | FlattenedArray<StorageProviderT> | undefined> {
        const fullKey = `${this.prefix}${index}`;
        const keys = await this.storage.ls();
        const relevantKeys = keys.filter(k => k.startsWith(fullKey));

        if (relevantKeys.length === 0) {
            return undefined;
        }

        if (relevantKeys.length === 1 && relevantKeys[0] === fullKey) {
            const value = await this.storage.get(fullKey);
            return value ? new TextDecoder().decode(value) : undefined;
        }

        if (relevantKeys.some(k => k.startsWith(`${fullKey}.`) && k.split('.').length > fullKey.split('.').length + 1)) {
            return new FlattenedMap(this.storage, `${fullKey}.`);
        }

        return new FlattenedArray(this.storage, `${fullKey}.`);
    }

    public async set(index: number, value: string | FlattenedMap<StorageProviderT> | FlattenedArray<StorageProviderT> | undefined): Promise<void> {
        const length = await this.length();
        if (index >= length) {
            throw new Error("Cannot set item with index greater than or equal to length");
        }

        const fullKey = `${this.prefix}${index}`;
        if (typeof value === 'string') {
            await this.storage.set(fullKey, new TextEncoder().encode(value));
        } else if (value instanceof FlattenedMap || value instanceof FlattenedArray) {
            await value.copyTo(this.storage, fullKey);
        } else if (value === undefined) {
            await this.delete(index);
        }
    }

    public async has(index: number): Promise<boolean> {
        return this.storage.has(`${this.prefix}${index}`);
    }

    public async delete(index: number): Promise<void> {
        const length = await this.length();
        if (index >= length) {
            return; // No need to delete if index is out of bounds
        }

        // Delete the item at the given index
        const fullKey = `${this.prefix}${index}`;
        const keys = await this.storage.ls();
        const relevantKeys = keys.filter(k => k.startsWith(fullKey));
        for (const key of relevantKeys) {
            await this.storage.set(key, undefined);
        }

        // Shift the remaining items
        for (let i = index + 1; i < length; i++) {
            const currentItem = await this.get(i);
            await this.set(i - 1, currentItem);
        }

        // Delete the last item (now duplicated)
        const lastKey = `${this.prefix}${length - 1}`;
        const lastKeys = keys.filter(k => k.startsWith(lastKey));
        for (const key of lastKeys) {
            await this.storage.set(key, undefined);
        }
    }

    public async insert(index: number, value: string | FlattenedMap<StorageProviderT> | FlattenedArray<StorageProviderT>): Promise<void> {
        const length = await this.length();
        if (index > length) {
            throw new Error("Cannot insert item at an index greater than length");
        }

        // Shift existing items to make room for the new item
        for (let i = length - 1; i >= index; i--) {
            const item = await this.get(i);
            await this.set(i + 1, item);
        }

        // Insert the new item
        await this.set(index, value);
    }

    public async push(value: string | FlattenedMap<StorageProviderT> | FlattenedArray<StorageProviderT>): Promise<number> {
        const length = await this.length();
        await this.set(length, value);
        return length + 1;
    }

    public async length(): Promise<number> {
        const keys = await this.storage.ls();
        const indices = keys
            .filter(k => k.startsWith(this.prefix))
            .map(k => parseInt(k.slice(this.prefix.length).split('.')[0]))
            .filter(i => !isNaN(i));
        return indices.length > 0 ? Math.max(...indices) + 1 : 0;
    }

    public async copyTo(storage: StorageProvider, newPrefix: string): Promise<void> {
        const keys = await this.storage.ls();
        const relevantKeys = keys.filter(k => k.startsWith(this.prefix));
        for (const key of relevantKeys) {
            const value = await this.storage.get(key);
            if (value) {
                await storage.set(newPrefix + key.slice(this.prefix.length), value);
            }
        }
    }
}

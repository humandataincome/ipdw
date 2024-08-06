import {StorageProvider} from "../storage";
import {FlattenedMap} from "./";

export class FlattenedArray {
    constructor(private storage: StorageProvider, private prefix: string = '') {
    }

    public async get(index: number): Promise<string | FlattenedMap | FlattenedArray | undefined> {
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

    public async set(index: number, value: string | FlattenedMap | FlattenedArray | undefined): Promise<void> {
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

    // TODO: Shift items
    public async delete(index: number): Promise<void> {
        const fullKey = `${this.prefix}${index}`;
        const keys = await this.storage.ls();
        const relevantKeys = keys.filter(k => k.startsWith(fullKey));
        for (const key of relevantKeys) {
            await this.storage.set(key, undefined);
        }
    }

    // TODO: add insert

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

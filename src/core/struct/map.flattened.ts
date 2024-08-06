import {StorageProvider} from "../storage";
import {FlattenedArray} from "./";

export class FlattenedMap {
    constructor(private storage: StorageProvider, private prefix: string = '') {
    }

    public async get(key: string): Promise<string | FlattenedMap | FlattenedArray | undefined> {
        const fullKey = `${this.prefix}${key}`;
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

    public async set(key: string, value: string | FlattenedMap | FlattenedArray | undefined): Promise<void> {
        const fullKey = `${this.prefix}${key}`;
        if (typeof value === 'string') {
            await this.storage.set(fullKey, new TextEncoder().encode(value));
        } else if (value instanceof FlattenedMap || value instanceof FlattenedArray) {
            await value.copyTo(this.storage, fullKey);
        } else if (value === undefined) {
            await this.delete(key);
        }
    }

    public async has(key: string): Promise<boolean> {
        return this.storage.has(`${this.prefix}${key}`);
    }

    public async delete(key: string): Promise<void> {
        const fullKey = `${this.prefix}${key}`;
        const keys = await this.storage.ls();
        const relevantKeys = keys.filter(k => k.startsWith(fullKey));
        for (const key of relevantKeys) {
            await this.storage.set(key, undefined);
        }
    }

    public async keys(): Promise<string[]> {
        const keys = await this.storage.ls();
        return keys
            .filter(k => k.startsWith(this.prefix))
            .map(k => k.slice(this.prefix.length).split('.')[0])
            .filter((v, i, a) => a.indexOf(v) === i);
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

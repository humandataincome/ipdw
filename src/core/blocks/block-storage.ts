import {StorageProvider} from "../";
import {TypedCustomEvent, TypedEventTarget} from "../../utils";
import {BlockFactory} from "./";

export class BlockStorage {
    public events: TypedEventTarget<{
        insert: TypedCustomEvent<{ index: number; value: Uint8Array }>;
        delete: TypedCustomEvent<{ index: number }>;
    }> = new TypedEventTarget();

    private storageProvider: StorageProvider;
    private blockFactory: BlockFactory;

    constructor(storageProvider: StorageProvider, blockFactory: BlockFactory) {
        this.storageProvider = storageProvider;
        this.blockFactory = blockFactory;
    }

    async get(index: number): Promise<Uint8Array | undefined> {
        const got = await this.storageProvider.get(index.toString());
        if (!got)
            return undefined;
        return this.blockFactory.decode(got);
    }

    async has(index: number): Promise<boolean> {
        return index < await this.length() && (await this.storageProvider.get(index.toString())) !== undefined;
    }

    async set(index: number, value: Uint8Array): Promise<void> {
        if (await this.has(index))
            await this.delete(index);
        await this.insert(index, value);
    }

    async insert(index: number, value: Uint8Array): Promise<void> {
        await this.storageProvider.set(index.toString(), await this.blockFactory.encode(value));
        this.events.dispatchTypedEvent('insert', new TypedCustomEvent('insert', {detail: {index, value}}));
    }

    async delete(index: number): Promise<void> {
        await this.storageProvider.set(index.toString(), undefined);
        this.events.dispatchTypedEvent('delete', new TypedCustomEvent('delete', {detail: {index}}));
    }

    async length(): Promise<number> {
        return (await this.storageProvider.ls()).length;
    }

    async append(value: Uint8Array): Promise<void> {
        await this.insert(await this.length(), value);
    }

    async toArray(): Promise<Array<Uint8Array | undefined>> {
        return Promise.all([...Array(await this.length()).keys()].map(this.get.bind(this)))
    }
}

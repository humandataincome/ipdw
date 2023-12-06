import {BlockStorage} from "../blocks/block.storage";
import {Buffer} from "buffer";

export class ArraySharded {
    private blockStorage: BlockStorage;

    constructor(blockStorage: BlockStorage) {
        this.blockStorage = blockStorage;
    }

    async get(index: number): Promise<string | undefined> {
        const got = await this.blockStorage.get(index);
        if (!got)
            return undefined;
        return Buffer.from(got).toString('utf8');
    }

    async push(value: string): Promise<void> {
        const lastIndex = await this.blockStorage.length();
        await this.blockStorage.insert(lastIndex, Buffer.from(value, 'utf8'));
    }
}

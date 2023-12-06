import {BlockStorage} from "../blocks/block.storage";
import {Buffer} from "buffer";

class StringSharded {
    private blockStorage: BlockStorage;

    constructor(blockStorage: BlockStorage) {
        this.blockStorage = blockStorage;
    }

    public async get(start: number = 0, end: number = -1): Promise<string> {
        let res = "";
        let count = 0;
        for (let i = 0; i < await this.blockStorage.length(); i++) {
            const got = await this.blockStorage.get(i);
            if (!got)
                break;
            const gotString = Buffer.from(got).toString('utf8');
            count += gotString.length;
            if (count > start)
                res += gotString.substring(count - start) // TO FINISH THIS
        }
        return res;
    }

    public async insert(index: number, value: string): Promise<void> {

    }

    public async delete(start: number = 0, end: number = -1): Promise<void> {

    }
}

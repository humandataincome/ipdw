import {BlockFactory} from "./block.factory";

export class CombinedBlockFactory implements BlockFactory {
    private blockFactories: Array<BlockFactory>;

    constructor(blockFactories: Array<BlockFactory>) {
        this.blockFactories = blockFactories;
    }

    async decode(block: Uint8Array): Promise<Uint8Array | undefined> {
        let res = block;
        for (let i = this.blockFactories.length - 1; i >= 0; i--)
            res = (await this.blockFactories[i].decode(res))!;

        return res;
    }

    async encode(value: Uint8Array): Promise<Uint8Array> {
        let res = value;
        for (let i = 0; i < this.blockFactories.length; i++)
            res = (await this.blockFactories[i].encode(res))!;
        return res;
    }

}

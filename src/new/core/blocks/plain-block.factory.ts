import {BlockFactory} from "./block.factory";


export class PlainBlockFactory implements BlockFactory {

    async decode(block: Uint8Array): Promise<Uint8Array | undefined> {
        return block;
    }

    async encode(value: Uint8Array): Promise<Uint8Array> {
        return value;
    }

}

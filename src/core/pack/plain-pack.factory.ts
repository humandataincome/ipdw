import {PackFactory} from "./";

export class PlainPackFactory implements PackFactory {
    async decode(pack: Uint8Array): Promise<Uint8Array | undefined> {
        return pack;
    }

    async encode(value: Uint8Array): Promise<Uint8Array> {
        return value;
    }
}

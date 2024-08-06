import {PackFactory} from "./";

export class CombinedPackFactory implements PackFactory {
    private packFactories: Array<PackFactory>;

    constructor(packFactories: Array<PackFactory>) {
        this.packFactories = packFactories;
    }

    async decode(pack: Uint8Array): Promise<Uint8Array | undefined> {
        let res = pack;
        for (let i = this.packFactories.length - 1; i >= 0; i--)
            res = (await this.packFactories[i].decode(res))!;

        return res;
    }

    async encode(value: Uint8Array): Promise<Uint8Array> {
        let res = value;
        for (let i = 0; i < this.packFactories.length; i++)
            res = (await this.packFactories[i].encode(res))!;
        return res;
    }

}

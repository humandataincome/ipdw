import {BlockStorage} from "../";
import {Buffer} from "buffer";

export class MapSharded {
    private blockStorage: BlockStorage;
    private readonly keys: string[] = [];

    constructor(blockStorage: BlockStorage, keys: string[]) {
        this.blockStorage = blockStorage;
        this.keys = keys;

        this.blockStorage.events.addEventListener('insert', async v => {
            if (!v.detail)
                return;

            const res = await MapSharded.decode(v.detail.value);
            if (!res || await this.get(res.key) === res.value)
                return;

            await this.set(res.key, res.value);
        });

        this.blockStorage.events.addEventListener('delete', async v => {
            if (!v.detail)
                return;
            await this.set(v.detail.index.toString(), undefined);
        });
    }

    public static async create(blockStorage: BlockStorage): Promise<MapSharded> {
        const keys: string[] = [];

        for (let i = 0; i < await blockStorage.length(); i++) {
            const block = await blockStorage.get(i);
            const res = await this.decode(block!);
            keys.push(res!.key);
        }

        return new MapSharded(blockStorage, keys);
    }

    private static async decode(block: Uint8Array): Promise<{ key: string, value: string } | undefined> {
        const blockBuffer = Buffer.from(block);

        const keyLength = blockBuffer.readUInt32LE(0);
        const keyBuffer = blockBuffer.subarray(4, 4 + keyLength);
        const valueBuffer = blockBuffer.subarray(4 + keyLength, blockBuffer.length);

        return {key: keyBuffer.toString('utf8'), value: valueBuffer.toString('utf8')};
    }

    private static async encode(key: string, value: string): Promise<Uint8Array> {
        const keyBuffer = Buffer.from(key, 'utf8');
        const valueBuffer = Buffer.from(value, 'utf8')
        const blockBuffer = Buffer.alloc(4 + keyBuffer.length + valueBuffer.length);

        blockBuffer.writeUInt32LE(keyBuffer.length, 0)
        blockBuffer.fill(keyBuffer, 4);
        blockBuffer.fill(valueBuffer, 4 + keyBuffer.length);

        return new Uint8Array(blockBuffer.buffer.slice(blockBuffer.byteOffset, blockBuffer.byteOffset + blockBuffer.byteLength));
    }

    public async get(key: string): Promise<string | undefined> {
        const index = this.keys.indexOf(key);
        if (index !== -1) {
            const block = await this.blockStorage.get(index);
            const res = await MapSharded.decode(block!);
            return res?.value;
        }
        return undefined;
    }

    public async set(key: string, value: string | undefined): Promise<void> {
        const index = this.keys.indexOf(key);

        if (value) {
            if (index !== -1) {
                this.keys[index] = value;
                await this.blockStorage.set(index, await MapSharded.encode(key, value));
            } else {
                this.keys.push(key);
                await this.blockStorage.append(await MapSharded.encode(key, value));
            }
        } else {
            if (index !== -1) {
                this.keys.splice(index, 1);
                await this.blockStorage.delete(index);
            }
        }
    }
}

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
            if (!res) {
                //If block failed to parse purge the block downstream
                return;
            }

            const index = this.keys.indexOf(res.key);

            this.keys.splice(v.detail.index, 0, res.key);

            if (index !== -1) {
                //If key is found, and could be shifted
                const prevIndex = index >= v.detail.index ? index + 1 : index;
                await this.blockStorage.delete(prevIndex);
            }

        });

        this.blockStorage.events.addEventListener('delete', async v => {
            if (!v.detail)
                return;
            this.keys.splice(v.detail.index, 1);
        });
    }

    public static async create(blockStorage: BlockStorage): Promise<MapSharded> {
        // On safari indexeddb could be slow
        const blocks = await Promise.all([...Array(await blockStorage.length()).keys()].map(i => blockStorage.get(i)!));
        const decoded = await Promise.all(blocks.map(b => this.decode(b!)));
        const keys = decoded.map(d => d!.key);

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
            if (block) {
                const res = await MapSharded.decode(block!);
                return res?.value;
            }
        }
        return undefined;
    }

    public async set(key: string, value: string | undefined): Promise<void> {
        const index = this.keys.indexOf(key);

        if (value) {
            if (index !== -1) {
                await this.blockStorage.set(index, await MapSharded.encode(key, value));
            } else {
                await this.blockStorage.append(await MapSharded.encode(key, value));
            }
        } else {
            if (index !== -1) {
                await this.blockStorage.delete(index);
            }
        }
    }

    public async ls(): Promise<string[]> {
        return this.keys;
    }
}

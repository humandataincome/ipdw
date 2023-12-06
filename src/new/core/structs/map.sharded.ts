import {BlockStorage} from "../blocks/block.storage";
import {Buffer} from "buffer";

export class MapSharded {
    private underlying: Record<string, string> = {};
    private blockStorage: BlockStorage;

    constructor(blockStorage: BlockStorage) {
        this.blockStorage = blockStorage;
        this.blockStorage.events.addEventListener('insert', async v => {
            if (!v.detail)
                return;

            const res = await this.decode(v.detail.value);
            if (!res)
                return;

            await this.set(res.key, res.value);
        });

        this.blockStorage.events.addEventListener('delete', async v => {
            if (!v.detail)
                return;
            await this.set(v.detail.index.toString(), undefined);
        });
    }

    public async get(key: string): Promise<string | undefined> {
        return this.underlying[key];
    }

    public async set(key: string, value: string | undefined): Promise<void> {
        if (value) {
            this.underlying[key] = value;
            await this.blockStorage.append(await this.encode(key, value));
        }
        else if (key in this.underlying) {
            delete this.underlying[key];
            await this.blockStorage.delete(0);
        }
    }

    private async decode(block: Uint8Array): Promise<{key: string, value: string} | undefined> {
        const blockBuffer = Buffer.from(block);

        const keyLength = blockBuffer.readUInt32LE(0)
        const keyBuffer = blockBuffer.subarray(32, keyLength);
        const valueBuffer = blockBuffer.subarray(32 + keyLength, blockBuffer.length);

        return {key: keyBuffer.toString('utf8'), value: valueBuffer.toString('utf8')};
    }

    private async encode(key: string, value: string): Promise<Uint8Array> {
        const keyBuffer = Buffer.from(key, 'utf8');
        const valueBuffer = Buffer.from(value, 'utf8')
        const blockBuffer = Buffer.alloc(32 + keyBuffer.length + valueBuffer.length);

        blockBuffer.writeUInt32LE(keyBuffer.length, 0)
        blockBuffer.fill(keyBuffer, 32);
        blockBuffer.fill(valueBuffer, 32 + keyBuffer.length);
        return new Uint8Array(blockBuffer.buffer.slice(blockBuffer.byteOffset, blockBuffer.byteOffset + blockBuffer.byteLength));
    }
}

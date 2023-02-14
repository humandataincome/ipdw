import {StorageProvider} from "./";

interface Metadata {
    chunksCount: number;
    length: number;
}

export class StreamProvider {
    private storage: StorageProvider;

    constructor(storage: StorageProvider) {
        this.storage = storage;
    }

    public async metadata(key: string): Promise<Metadata> {
        return JSON.parse(new TextDecoder().decode(await this.storage.get(key + "_"))) as Metadata;
    }

    public async has(key: string): Promise<boolean> {
        return this.storage.has(key + "_");
    }

    // Resumable
    public async getWritable(key: string, chunkSize: number = 131072 /* 128kb default*/): Promise<WritableStream> {
        const metadata = {chunksCount: 0, totalLength: 0};

        let tmp = new Uint8Array(chunkSize);
        let tmpSize = 0;

        const _self = this;

        return new WritableStream<Uint8Array>({
            async write(chunk) {
                let writtenSize = 0;
                while (writtenSize < chunk.length) {
                    const writableSize = Math.min(chunkSize - tmpSize, chunk.length - writtenSize);
                    const subChunk = chunk.slice(0, writableSize);

                    tmp.set(subChunk, tmpSize);
                    tmpSize += writableSize;
                    writtenSize += writableSize

                    if (tmpSize === chunkSize) {
                        metadata.chunksCount++;
                        metadata.totalLength += tmpSize;
                        tmpSize = 0;

                        await _self.storage.set(key + "_" + (metadata.chunksCount - 1), tmp);
                        await _self.storage.set(key + "_", new TextEncoder().encode(JSON.stringify(metadata)))
                    }
                }
            },
            async close() {
                metadata.chunksCount++;
                metadata.totalLength += tmpSize;

                await _self.storage.set(key + "_" + (metadata.chunksCount - 1), tmp.slice(0, tmpSize));
                await _self.storage.set(key + "_", new TextEncoder().encode(JSON.stringify(metadata)))
            }
        });
    }

    public async getReadable(key: string): Promise<ReadableStream> {
        const metadata = JSON.parse(new TextDecoder().decode(await this.storage.get(key + "_"))) as Metadata;

        const _self = this;
        return new ReadableStream<Uint8Array>({
            async start(controller) {
                for (let pivot = 0; pivot < metadata.chunksCount; pivot++)
                    controller.enqueue(await _self.storage.get(key + "_" + pivot));
                controller.close();
            },
        });
    }
}

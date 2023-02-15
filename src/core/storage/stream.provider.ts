import {StorageProvider} from "./";

interface Metadata {
    chunks: number;
    size: number;
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

    public async getWritable(key: string, maxChunkSize: number = 131072 /* 128kb default*/, append: boolean = false): Promise<WritableStream> {
        let metadata = {chunks: 0, size: 0};
        let tmp = {chunk: new Uint8Array(maxChunkSize), size: 0};

        if (await this.storage.has(key + "_")) {
            const tmpMetadata = JSON.parse(new TextDecoder().decode(await this.storage.get(key + "_"))) as Metadata

            if (append && tmpMetadata.chunks > 0) {
                const lastChunk = await this.storage.get(key + "_" + (tmpMetadata.chunks - 1));
                if (lastChunk!.length < maxChunkSize) {
                    tmp.size = lastChunk!.length;
                    tmp.chunk.set(lastChunk!, 0);
                    metadata.chunks = tmpMetadata.chunks - 1;
                    metadata.size = tmpMetadata.size - tmp.size;
                } else {
                    metadata.chunks = tmpMetadata.chunks;
                    metadata.size = tmpMetadata.size;
                }
            } else {
                for (let pivot = tmpMetadata.chunks - 1; pivot >= 0; pivot--)
                    await this.storage.set(key + "_" + pivot, undefined);

                await this.storage.set(key + "_", undefined);
            }
        }

        const _self = this;
        return new WritableStream<Uint8Array>({
            async write(chunk) {
                let writtenSize = 0;

                while (writtenSize < chunk.length) {
                    const writableSize = Math.min(maxChunkSize - tmp.size, chunk.length - writtenSize);
                    const subChunk = chunk.slice(writtenSize, writtenSize + writableSize);

                    tmp.chunk.set(subChunk, tmp.size);
                    tmp.size += writableSize;
                    writtenSize += writableSize

                    if (tmp.size === maxChunkSize) {
                        metadata.chunks++;
                        metadata.size += tmp.size;
                        tmp.size = 0;

                        await _self.storage.set(key + "_" + (metadata.chunks - 1), tmp.chunk);
                        await _self.storage.set(key + "_", new TextEncoder().encode(JSON.stringify(metadata)))
                    }
                }
            },
            async close() {
                if (tmp.size > 0) {
                    metadata.chunks++;
                    metadata.size += tmp.size;

                    await _self.storage.set(key + "_" + (metadata.chunks - 1), tmp.chunk.slice(0, tmp.size));
                    await _self.storage.set(key + "_", new TextEncoder().encode(JSON.stringify(metadata)))
                }
            }
        });
    }

    public async getReadable(key: string, maxChunkSize: number = 131072 /* 128kb default*/): Promise<ReadableStream> {
        const metadata = JSON.parse(new TextDecoder().decode(await this.storage.get(key + "_"))) as Metadata;
        let pivot = {chunk: 0, end: 0};
        let chunk: Uint8Array | undefined;

        const _self = this;
        return new ReadableStream<Uint8Array>({
            async pull(controller) { // Using pull function instead of start to read it asynchronously
                let tmp = {chunk: new Uint8Array(maxChunkSize), size: 0};

                while (pivot.chunk < metadata.chunks) {
                    if (pivot.end === 0)
                        chunk = await _self.storage.get(key + "_" + pivot.chunk);

                    const readableSize = Math.min(maxChunkSize - tmp.size, chunk!.length - pivot.end);

                    const subChunk = chunk!.slice(pivot.end, pivot.end + readableSize);
                    tmp.chunk.set(subChunk, tmp.size);

                    tmp.size += readableSize;
                    pivot.end += readableSize;

                    if (pivot.end === chunk!.length) {
                        pivot.chunk++;
                        pivot.end = 0;
                    }

                    if (tmp.size === maxChunkSize) {
                        controller.enqueue(tmp.chunk);
                        return;
                    }
                }

                if (tmp.size > 0)
                    controller.enqueue(tmp.chunk.slice(0, tmp.size));
                controller.close();
            },
        });
    }
}

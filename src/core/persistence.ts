import {FileSystemStorageProvider, IndexedDBStorageProvider, StorageProvider, StreamProvider} from "./storage";
import {IPFSManager} from "./ipfs";
import {HashUtils, StreamUtils} from "../utils";

export class Persistence {
    private static instance: Persistence;

    public storage: StorageProvider;
    public stream: StreamProvider;

    constructor(storage: StorageProvider) {
        this.storage = storage;
        this.stream = new StreamProvider(this.storage);
    }

    public static async getInstance(basePath: string = ".persistence/"): Promise<Persistence> {
        if (!this.instance) {
            this.instance = new Persistence(
                typeof window === 'object' || typeof importScripts === 'function' ?
                    await IndexedDBStorageProvider.Init(basePath) :
                    new FileSystemStorageProvider(basePath));
        }

        return this.instance;
    }

    public async fetchOrGet(url: string, progress: ((progress: number) => void) | undefined = undefined): Promise<Uint8Array | undefined> { // support for [file://, http(s)://, ip(f/n)s://]
        const storageKey = (await HashUtils.pbkdf2(url, "", 1, 32, "sha256")).toString("hex");

        let storageValueSize = 0;
        if (await this.stream.has(storageKey)) {
            const storageMetadata = await this.stream.metadata(storageKey);
            if (storageMetadata.done)
                return StreamUtils.GetAsUint8Array(await this.stream.getReadable(storageKey, 1048576));

            storageValueSize = storageMetadata.size;
        }

        const parsedUrl = new URL(url);

        let expectedSize = 0;
        switch (parsedUrl.protocol) {
            case "file:":
            case "http:":
            case "https:":
                const res = await fetch(parsedUrl.toString(), {method: 'HEAD'});
                expectedSize = +res.headers.get("Content-Length")!
                break;
            case "ipfs:":
            case "ipns:":
                const ipfs = await IPFSManager.getInstance();
                expectedSize = (await ipfs.getStats(parsedUrl.host)).size;
                break;
        }

        if (storageValueSize === expectedSize)
            return StreamUtils.GetAsUint8Array(await this.stream.getReadable(storageKey, 1048576));

        let readable: ReadableStream<Uint8Array>;

        switch (parsedUrl.protocol) { // support for [file://, http(s)://, ip(f/n)s://]
            case "file:":
            case "http:":
            case "https:":
                const res = await fetch(parsedUrl, {method: 'GET', headers: {"Range": `bytes=${storageValueSize}-`}});
                readable = res.body!;
                break;
            case "ipfs:":
            case "ipns:":
                const ipfs = await IPFSManager.getInstance();
                readable = await ipfs.readStream(parsedUrl.host, storageValueSize);
                break;
        }

        const progressStream = StreamUtils.ProgressStream(expectedSize, progress, storageValueSize);
        const writer = await this.stream.getWritable(storageKey, 1048576, true);
        await readable!.pipeThrough(progressStream).pipeTo(writer);

        return StreamUtils.GetAsUint8Array(await this.stream.getReadable(storageKey, 1048576))
    }

}

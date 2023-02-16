import {FileSystemStorageProvider, IndexedDBStorageProvider, StorageProvider, StreamProvider} from "./storage";
import crypto from "crypto";
import {IPFSManager} from "./ipfs";
import {StreamUtils} from "../utils/stream";

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
                typeof window === 'undefined' ?
                    new FileSystemStorageProvider(basePath) :
                    await IndexedDBStorageProvider.Init());
        }

        return this.instance;
    }

    public async fetchOrGet(url: string, progress: ((progress: number) => void) | undefined = undefined): Promise<Uint8Array | undefined> { // support for [file://, http(s)://, ip(f/n)s://]
        const parsedUrl = new URL(url);

        let expectedSize = 0;
        switch (parsedUrl.protocol) {
            case "file:":
            case "http:":
            case "https:":
                const res = await fetch(parsedUrl.toString(), {method: 'OPTIONS'});
                expectedSize = +res.headers.get("Content-Length")!
                break;
            case "ipfs:":
            case "ipns:":
                const ipfs = await IPFSManager.getInstance();
                expectedSize = (await ipfs.getStats(parsedUrl.host)).size;
                break;
        }

        const storageKey = crypto.pbkdf2Sync(url, "", 1, 32, "sha256").toString("hex");

        let storageValueSize = 0;
        if (await this.stream.has(storageKey)) {
            storageValueSize = (await this.stream.metadata(storageKey)).size;
            if (storageValueSize === expectedSize)
                return StreamUtils.GetAsUint8Array(await this.stream.getReadable(storageKey));
        }

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

        return StreamUtils.GetAsUint8Array(await this.stream.getReadable(storageKey))
    }

}

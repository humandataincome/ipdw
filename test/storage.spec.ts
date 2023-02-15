import {
    FileSystemStorageProvider,
    IndexedDBStorageProvider,
    IPFSManager,
    MemoryStorageProvider,
    StreamProvider
} from "../src";

import "fake-indexeddb/auto";

describe("Simple expression tests", async () => {
    it("Check MemoryStorageProvider", async () => {
        const storage = new MemoryStorageProvider();

        let res;
        await storage.set("key1", new TextEncoder().encode("value1"));

        res = await storage.ls();
        console.log(res);

        res = await storage.has("key1");
        console.log(res);

        res = await storage.get("key1");
        console.log(new TextDecoder().decode(res));
    });

    it("Check FileSystemStorageProvider", async () => {
        const storage = new FileSystemStorageProvider();

        let res;
        await storage.set("key1", new TextEncoder().encode("value1"));

        res = await storage.ls();
        console.log(res);

        res = await storage.has("key1");
        console.log(res);

        res = await storage.get("key1");
        console.log(new TextDecoder().decode(res));
    });

    it("Check IndexedDBStorageProvider", async () => {
        const storage = await IndexedDBStorageProvider.Init();

        let res;
        await storage.set("key1", new TextEncoder().encode("value1"));

        res = await storage.ls();
        console.log(res);

        res = await storage.has("key1");
        console.log(res);

        res = await storage.get("key1");
        console.log(new TextDecoder().decode(res));
    });

    it("Check StreamProvider", async () => {
        const storage = new MemoryStorageProvider();
        //const storage = new FileSystemStorageProvider();
        //const storage = await IndexedDBStorageProvider.Init();
        const stream = new StreamProvider(storage);

        let res;
        res = (await stream.getWritable("key1", 3, true)).getWriter();
        await res.write(new TextEncoder().encode("va"));
        await res.write(new TextEncoder().encode("lue1"));
        await res.close();

        res = await stream.has("key1");
        console.log(res);

        res = (await stream.getReadable("key1", 2)).getReader();
        let chunk;
        while (!(chunk = await res.read()).done) {
            console.log('chunk:', new TextDecoder().decode(chunk.value));
        }
    });

    it("Check IPFS streamed storage", async () => {
        const storage = new FileSystemStorageProvider();
        const stream = new StreamProvider(storage);

        //const cid = "Qma5BYqiv2XMgEyNFGg8CGhSKHPGbBgxo1nmX8BnxKqQPB";
        const cid = "QmecpDvGdWfcKw7BM4nxyEb7TB856sTY1MqY1dCR45rWjv";
        const ipfs = await IPFSManager.getInstance();
        //await ipfs.read(cid);
        const reader = await ipfs.readStream(cid);
        const writer = await stream.getWritable("file1");

        let offset = 0;
        const size = (await ipfs.node.files.stat("/ipfs/" + cid)).size;

        console.log("Loading...");

        const progressStream = new TransformStream<Uint8Array, Uint8Array>({
            async transform(chunk, controller) {
                offset += chunk.length;
                const progress = offset / size;
                console.log(progress);
                controller.enqueue(chunk);
            }
        });

        await reader.pipeThrough(progressStream).pipeTo(writer);
    }).timeout(60000);
});

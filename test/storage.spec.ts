import {FileSystemStorageProvider, IndexedDBStorageProvider, MemoryStorageProvider} from "../src";

import "fake-indexeddb/auto";

describe("Storage tests", async () => {
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
});

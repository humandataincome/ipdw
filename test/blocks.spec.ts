import {BlockStorage, CombinedBlockFactory, EncryptedBlockFactory, FileSystemStorageProvider, MapSharded, MemoryStorageProvider, PlainBlockFactory, SignedBlockFactory} from "../src";

import "fake-indexeddb/auto";

describe("Blocks tests", async () => {
    it("Check block", async () => {
        const keyBuffer = Buffer.from([]);
        const publicKeyBuffer = Buffer.from([]);
        const privateKeyBuffer = Buffer.from([]);

        const storageProvider = new MemoryStorageProvider();

        const encryptedBlockFactory = new EncryptedBlockFactory(keyBuffer);
        const signedBlockFactory = new SignedBlockFactory(publicKeyBuffer, privateKeyBuffer);

        const privateBlockFactory = new CombinedBlockFactory([encryptedBlockFactory, signedBlockFactory]);
        const blockStorage = new BlockStorage(storageProvider, privateBlockFactory);

        const plainBlock = new Uint8Array([1, 4, 6]);
        console.log('plainBlock', plainBlock);
        const encryptedBlock = await encryptedBlockFactory.encode(plainBlock);
        console.log('encryptedBlock', encryptedBlock);
        const signedBlock = await signedBlockFactory.encode(encryptedBlock);
        console.log('signedBlock', signedBlock);

        await blockStorage.insert(0, signedBlock);

        const savedBlock = await blockStorage.get(0);
        console.log('savedBlock', savedBlock);
        const verifiedBlock = await signedBlockFactory.decode(savedBlock!);
        console.log('verifiedBlock', verifiedBlock);
        const decryptedBlock = await encryptedBlockFactory.decode(verifiedBlock!);
        console.log('decryptedBlock', decryptedBlock);
    });

    it("Check events with map sharded", async () => {
        const storageProvider = new FileSystemStorageProvider();
        const plainBlockFactory = new PlainBlockFactory();
        const blockStorage = new BlockStorage(storageProvider, plainBlockFactory);

        blockStorage.events.addEventListener('insert', e => console.log('insert', e.detail!.index, e.detail!.value));
        blockStorage.events.addEventListener('delete', e => console.log('delete', e.detail!.index));

        const mapSharded = new MapSharded(blockStorage);
        await mapSharded.set('test', '12345');
    });
});

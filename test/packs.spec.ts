import {CombinedPackFactory, CryptoUtils, EncryptedPackFactory, MemoryStorageProvider, PackedStorageOverlay, SignedPackFactory} from "../src";

import "fake-indexeddb/auto";

describe("Blocks tests", async () => {
    it("Check block", async () => {
        const master = Buffer.from("supersecret", "utf8");
        const salt = Buffer.from("6GvSeDY1", "utf8");

        const keyBuffer = await CryptoUtils.DeriveKey(master, salt);
        console.log('keyBuffer', keyBuffer.toString('hex'));

        const [privateKeyBuffer, publicKeyBuffer] = await CryptoUtils.DeriveKeyPair(master, salt);

        console.log('privateKey', privateKeyBuffer.toString('hex'));
        console.log('publicKey', publicKeyBuffer.toString('hex'));

        const storageProvider = new MemoryStorageProvider();

        const encryptedBlockFactory = new EncryptedPackFactory(keyBuffer);
        const signedBlockFactory = new SignedPackFactory(publicKeyBuffer, privateKeyBuffer);

        const privateBlockFactory = new CombinedPackFactory([encryptedBlockFactory, signedBlockFactory]);
        const blockStorage = new PackedStorageOverlay(storageProvider, encryptedBlockFactory, privateBlockFactory);

        const plainBlock = new Uint8Array([1, 4, 6]);
        console.log('plainBlock', plainBlock);
        const encryptedBlock = await encryptedBlockFactory.encode(plainBlock);
        console.log('encryptedBlock', encryptedBlock);
        const signedBlock = await signedBlockFactory.encode(encryptedBlock);
        console.log('signedBlock', signedBlock);

        await blockStorage.set('0', signedBlock);

        const savedBlock = await blockStorage.get('0');
        console.log('savedBlock', savedBlock);
        const verifiedBlock = await signedBlockFactory.decode(savedBlock!);
        console.log('verifiedBlock', verifiedBlock);
        const decryptedBlock = await encryptedBlockFactory.decode(verifiedBlock!);
        console.log('decryptedBlock', decryptedBlock);
    });
});

/*
Wallet(IPDW TEST) - Address: 0xB5ea1eC38f0547004d5841a2FB5F33Ee07113Bcf - Private key: 0xb577c4367d79f1a7a0c8353f7937d601758d92c35df958781d72d70f9177e52f
 */

import {IPDW, MemoryStorageProvider} from "../src";

async function startNode(): Promise<void> {
    //const [privateKeyBuffer, publicKeyBuffer] = await CryptoUtils.DeriveKeyPair(Buffer.from(seed, 'utf8'), salt); // If you want to start from salt
    const ipdw = await IPDW.create('b577c4367d79f1a7a0c8353f7937d601758d92c35df958781d72d70f9177e52f', new MemoryStorageProvider());

    /*
    // This is for testing single key overwriting
    setInterval(async () => {
        const res = await ipdw.data.get('test') || 'init';
        console.log('test', ipdw.synchronization.node.peerId, res);
        await ipdw.data.set('test', res + (Math.random() + 1).toString(36).substring(2));
    }, 1000);
     */

    // This is for testing multiple keys writing
    setInterval(async () => {
        const randomString = (Math.random() + 1).toString(36).substring(2);
        await ipdw.data.set(randomString, 'value');
        console.log('keys', ipdw.synchronization.node.peerId, JSON.stringify(await ipdw.data.ls()));
    }, 1000);
}

async function main(): Promise<void> {
    await startNode();
    await startNode();
}

(async () => {
    await main();
})();

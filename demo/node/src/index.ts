/*
Wallet(IPDW TEST) - Address: 0xB5ea1eC38f0547004d5841a2FB5F33Ee07113Bcf - Private key: 0xb577c4367d79f1a7a0c8353f7937d601758d92c35df958781d72d70f9177e52f
 */


import {IPDW, MemoryStorageProvider} from "ipdw";

async function main(): Promise<void> {
    const ipdw = await IPDW.create('0xb577c4367d79f1a7a0c8353f7937d601758d92c35df958781d72d70f9177e52f', new MemoryStorageProvider());

    setInterval(async () => {
        const res = await ipdw.data.get('test') || 'init';
        console.log('test', ipdw.syncProvider.node.peerId, res);
        await ipdw.data.set('test', res + (Math.random() + 1).toString(36).substring(2));
    }, 1000);
}

(async () => {
    await main();
})();

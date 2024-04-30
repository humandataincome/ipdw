/*
Wallet(IPDW TEST) - Address: 0xB5ea1eC38f0547004d5841a2FB5F33Ee07113Bcf - Private key: 0xb577c4367d79f1a7a0c8353f7937d601758d92c35df958781d72d70f9177e52f
 */

import {IPDW, MemoryStorageProvider, webRTCPolyfillListen} from "ipdw";

localStorage.debug = 'libp2p:*'

const orig_console_log = console.log;
console.log = function (...e) {
    document.write(e.map(v => JSON.stringify(v)).join(' '), '</br>');
    orig_console_log(...e);
}

async function main(): Promise<void> {
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


    /*
    // This is for getting data from other devices
    setInterval(async () => {
        console.log(await ipdw.data.ls())
        console.log(Promise.all((await ipdw.data.ls()).map(k => ipdw.data.get(k))));
    }, 1000);
     */
}

async function workerMain(): Promise<void> {
    console.log('executing window');
    // Open chrome://inspect/#workers to inspect it
    const worker = new SharedWorker("index.worker.js");
    worker.port.addEventListener('message', (e) => {
        //console.log(e.data)
        if (e.data.command === 'CONSOLE')
            console.log(e.data.data)
    });
    worker.port.start();
    webRTCPolyfillListen(worker.port);
    console.log('executed window');
}

(async () => {
    //await main();
    await workerMain();
})();

/*
Wallet(IPDW TEST) - Address: 0xB5ea1eC38f0547004d5841a2FB5F33Ee07113Bcf - Private key: 0xb577c4367d79f1a7a0c8353f7937d601758d92c35df958781d72d70f9177e52f
 */

import {IPDW, MemoryStorageProvider, webRTCPolyfillCreate} from "ipdw";

let port: MessagePort;

const orig_console_log = console.log;
console.log = function (...e) {
    //document.write(e.map(v => JSON.stringify(v)).join(' '), '</br>');
    if (port) port.postMessage({command: 'CONSOLE', data: e});
    orig_console_log(...e);
}

async function main(): Promise<void> {
    const ipdw = await IPDW.create('b577c4367d79f1a7a0c8353f7937d601758d92c35df958781d72d70f9177e52f', new MemoryStorageProvider());

    // This is for testing multiple keys writing
    setInterval(async () => {
        const randomString = (Math.random() + 1).toString(36).substring(2);
        await ipdw.data.set(randomString, 'value');
        console.log('keys', ipdw.synchronization.node.peerId, JSON.stringify(await ipdw.data.ls()));
    }, 1000);
}

async function workerMain(): Promise<void> {
    console.log('executing worker');

    interface SharedWorkerGlobalScope {
        onconnect: (event: MessageEvent) => void;
    }

    const _self: SharedWorkerGlobalScope = self as any;
    await new Promise<void>((resolve) => {
        _self.onconnect = function (e) {
            console.log('worker onconnect', e);
            port = e.ports[0];
            webRTCPolyfillCreate(e.ports[0]);
            resolve();
            port.start();
        }
    });

    await main();
    console.log('executed worker');
}

(async () => {
    await workerMain();
})();

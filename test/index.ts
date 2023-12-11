import {BlockStorage, FileSystemStorageProvider, IPDW, MemoryStorageProvider, P2PSyncProvider, PlainBlockFactory} from "../src";
import * as web3 from "web3"

async function main() {
    /*
    const privateKey = "0xeffc0f0bac08c2157c8bcabfbbe71df7c96b499defcfdae2210139418618d574";
    const storageProvider = new FileSystemStorageProvider();
    const ipdw = await IPDW.create((msg) => web3.eth.accounts.sign(msg, privateKey).signature, storageProvider);
    await ipdw.storage.set('aaa', 'bbb');
    console.log(await ipdw.storage.get('aaa'));
     */

    const blockStorage = new BlockStorage(new MemoryStorageProvider(), new PlainBlockFactory());
    await P2PSyncProvider.create(blockStorage, 'test1234');

    await blockStorage.set(0, new Uint8Array([1,3,4]));
}

(async () => {
    await main();
})();

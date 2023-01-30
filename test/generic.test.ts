import {IPDW, MemoryStorageProvider} from "../src";

async function main() {
    const ipdw = await IPDW.create(async (msg: string) => msg, 'Global', new MemoryStorageProvider());
    await ipdw.addMessageListener('PLAIN', 'bla bla', console.log);
    await ipdw.sendMessage('PLAIN', 'bla bla', 'Hello World');
}

(async () => {
    await main();
})();


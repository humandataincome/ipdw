import {IPDW, MemoryStorageProvider} from "../src";
import Web3 from "web3";

async function startNode(): Promise<void> {
    const web3 = new Web3(Web3.givenProvider || "https://bsc-dataseed.binance.org/");

    const account = web3.eth.accounts.privateKeyToAccount("0xeffc0f0bac08c2157c8bcabfbbe71df7c96b499defcfdae2210139418618d574");
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;

    const ipdw = await IPDW.create(async (msg: string) => (await web3.eth.sign(msg, web3.eth.defaultAccount!) as any).signature, account.address, new MemoryStorageProvider(), 'Global');

    setInterval(async () => {
        const res = await ipdw.storage.get('test') || 'init';
        console.log(res);
        await ipdw.storage.set('test', res + (Math.random() + 1).toString(36).substring(2));
    }, 1000);
}

async function main(): Promise<void> {
    await startNode();
    await startNode();
}

(async () => {
    await main();
})();

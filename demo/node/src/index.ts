/*
Wallet(test) - Address: 0xb9470887f963694195053Da319e17dd44CCfFC46 - Private key: 0xeffc0f0bac08c2157c8bcabfbbe71df7c96b499defcfdae2210139418618d574
 */

import Web3 from "web3";
import {IPDW, MemoryStorageProvider} from "ipdw";

async function main() {
    const web3 = new Web3(Web3.givenProvider || "https://bsc-dataseed.binance.org/");

    const account = web3.eth.accounts.privateKeyToAccount("0xeffc0f0bac08c2157c8bcabfbbe71df7c96b499defcfdae2210139418618d574");
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;
    console.log(account.address);

    const ipdw = await IPDW.create(async (msg: string) => (await web3.eth.sign(msg, web3.eth.defaultAccount!) as any).signature, account.address, new MemoryStorageProvider(), 'Global');

    await ipdw.storage.set('aaa', 'bbb');
    console.log(await ipdw.storage.get('aaa'));
}

(async () => {
    await main();
})();

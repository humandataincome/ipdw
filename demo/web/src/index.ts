/*
Wallet(test) - Address: 0xb9470887f963694195053Da319e17dd44CCfFC46 - Private key: 0xeffc0f0bac08c2157c8bcabfbbe71df7c96b499defcfdae2210139418618d574
URL(test) - https://ipfs.io/ipfs/QmNRCQWfgze6AbBCaT1rkrkV5tJ2aP4oTNPb5JZcXYywve or https://gateway.pinata.cloud/ipfs/QmW7fmJG5i3S6K6EPBPYYqkzkn2G1mNz8MEBiDGEFhPrKv
 */

import Web3 from "web3";
import {IPDW, MemoryStorageProvider} from "ipdw";
import {Buffer} from "buffer"; //PAY ATTENTION TO USE THIS OR USE "PROVIDE PLUGIN" IN WEBPACK

async function main() {
    const web3 = new Web3(Web3.givenProvider || "https://bsc-dataseed.binance.org/");

    const account = web3.eth.accounts.privateKeyToAccount("0xeffc0f0bac08c2157c8bcabfbbe71df7c96b499defcfdae2210139418618d574");
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;
    console.log(account.address);


    const ipdw = await IPDW.create(async (msg: string) => (await web3.eth.sign('aasdasds', web3.eth.defaultAccount!) as any).signature, 'Global', new MemoryStorageProvider());

    const data = {hello: "world"};

    console.log('PUSHING LOCAL DATA TO REMOTE', data);
    const dataBuffer = Buffer.from(JSON.stringify(data), 'utf8');
    await ipdw.setData(dataBuffer, 'ENCRYPTED');
    await ipdw.push();
    console.log('PUSHED LOCAL DATA TO REMOTE');

    console.log('PULLING REMOTE DATA TO LOCAL');
    await ipdw.pull();
    const gotDataBuffer = await ipdw.getData('ENCRYPTED')
    const gotData = JSON.parse(gotDataBuffer.toString('utf8'));
    console.log('PULLED REMOTE DATA TO LOCAL', gotData);

    await ipdw.addMessageListener('PLAIN', 'bla bla', console.log);

    await ipdw.sendMessage('PLAIN', 'bla bla', 'Hello World');
}

(async () => {
    await main();
})();

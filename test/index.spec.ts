/*
Wallet(test) - Address: 0xb9470887f963694195053Da319e17dd44CCfFC46 - Private key: 0xeffc0f0bac08c2157c8bcabfbbe71df7c96b499defcfdae2210139418618d574
URL(test) - https://ipfs.io/ipfs/QmNRCQWfgze6AbBCaT1rkrkV5tJ2aP4oTNPb5JZcXYywve or https://gateway.pinata.cloud/ipfs/QmW7fmJG5i3S6K6EPBPYYqkzkn2G1mNz8MEBiDGEFhPrKv
 */

import {IPDW, IPFSManager, MemoryStorageProvider} from "../src";

describe("Simple expression tests", async () => {

    it("Check 1", async () => {
        const ipdw = await IPDW.create(async (msg) => "d0a1f5e6ded71af9c15311c801e234522b", 'Global', new MemoryStorageProvider());
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
    });

});

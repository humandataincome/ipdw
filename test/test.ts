/*
Wallet(test) - Address: 0xb9470887f963694195053Da319e17dd44CCfFC46 - Private key: 0xeffc0f0bac08c2157c8bcabfbbe71df7c96b499defcfdae2210139418618d574
URL(test) - https://ipfs.io/ipfs/QmNRCQWfgze6AbBCaT1rkrkV5tJ2aP4oTNPb5JZcXYywve or https://gateway.pinata.cloud/ipfs/QmW7fmJG5i3S6K6EPBPYYqkzkn2G1mNz8MEBiDGEFhPrKv
 */

import Web3 from "web3";
import {IPFSManager} from "../src/core/ipfs";
import {E2EManager} from "../src/core/e2e";
import {DecryptedVault, Vault} from "../src/core/vault";
import {IPDW} from "../src";

async function main() {
    const web3 = new Web3(Web3.givenProvider || "https://bsc-dataseed.binance.org/");

    const account = web3.eth.accounts.privateKeyToAccount("0xeffc0f0bac08c2157c8bcabfbbe71df7c96b499defcfdae2210139418618d574");
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;

    const data = {hello: "world"};
    const name = await IPDW.publish(web3, data);
    console.log("published url:", `https://gateway.pinata.cloud/ipns/${name}`);
    const retrievedData = await IPDW.retrieve(web3);
    console.log('retrievedData:', retrievedData);
}

(async () => {
    await main();
})();

import Web3 from "web3";
import {E2EManager} from "./core/e2e";
import {Vault} from "./core/vault";
import {IPFSManager} from "./core/ipfs";

export class IPDW {
    public static async publish(web3: Web3, data: unknown): Promise<string> {
        const signature = await web3.eth.sign("Login to your InterPlanetary Data Wallet <3 (by Andrea Silvi)", web3.eth.defaultAccount || 0);

        const privateKey = E2EManager.generateKeyPair(signature).privateKey;
        const password = signature + "DW$"
        const encryptedVault = await Vault.lock(data, password);

        const ipfs = await IPFSManager.getInstance();
        return await ipfs.writeNamed(encryptedVault.toString('base64'), privateKey);
    }

    public static async retrieve(web3: Web3): Promise<unknown> {
        const signature = await web3.eth.sign("Login to your InterPlanetary Data Wallet <3 (by Andrea Silvi)", web3.eth.defaultAccount || 0);

        const privateKey = E2EManager.generateKeyPair(signature).privateKey;
        const password = signature + "DW$"
        const ipfs = await IPFSManager.getInstance();

        const resolvedContent = Buffer.from(await ipfs.readNamed(privateKey), 'base64');

        return await Vault.unlock(resolvedContent, password);
    }
}

import Web3 from "web3";
import {E2EManager} from "./core/e2e";
import {Vault} from "./core/vault";
import {IPFSManager} from "./core/ipfs";

export class IPDW {
    public static async publish(data: unknown, sign: (msg: string) => Promise<string>): Promise<string> {
        const signature = await sign("Login to your InterPlanetary Data Wallet <3 (by Andrea Silvi)");

        const privateKey = E2EManager.generateKeyPair(signature).privateKey;
        const password = signature + "DW$"
        const encryptedVault = await Vault.lock(data, password);

        const ipfs = await IPFSManager.getInstance();
        return await ipfs.writeNamed(encryptedVault.toString('base64'), privateKey);
    }

    public static async retrieve(sign: (msg: string) => Promise<string>): Promise<unknown> {
        const signature = await sign("Login to your InterPlanetary Data Wallet <3 (by Andrea Silvi)");

        const privateKey = E2EManager.generateKeyPair(signature).privateKey;
        const password = signature + "DW$"
        const ipfs = await IPFSManager.getInstance();

        const resolvedContent = Buffer.from(await ipfs.readNamed(privateKey), 'base64');

        return await Vault.unlock(resolvedContent, password);
    }
}

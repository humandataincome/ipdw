import algosdk from 'algosdk';

import {StorageProvider} from "./";

export class AlgorandStorageProvider implements StorageProvider {
    private client: algosdk.Algodv2;
    private appId: number;
    private senderAccount: algosdk.Account;

    constructor(
        algodToken: string,
        algodServer: string,
        algodPort: string,
        appId: number,
        senderMnemonic: string
    ) {
        this.client = new algosdk.Algodv2(algodToken, algodServer, algodPort);
        this.appId = appId;
        this.senderAccount = algosdk.mnemonicToSecretKey(senderMnemonic);
    }

    async set(key: string, value: Uint8Array | undefined): Promise<void> {
        const appArgs = [
            new TextEncoder().encode("set"),
            new TextEncoder().encode(key),
            value || new Uint8Array(0)
        ];
        const boxes = [{appIndex: this.appId, name: new TextEncoder().encode(key)}];
        await this.sendTransaction(appArgs, boxes);
    }

    async has(key: string): Promise<boolean> {
        const appArgs = [
            new TextEncoder().encode("has"),
            new TextEncoder().encode(key)
        ];
        const boxes = [{appIndex: this.appId, name: new TextEncoder().encode(key)}];

        try {
            await this.sendTransaction(appArgs, boxes);
            return true;
        } catch (error: any) {
            if (error.message.includes("box not found")) {
                return false;
            }
            throw error;
        }
    }

    async get(key: string): Promise<Uint8Array | undefined> {
        const appArgs = [
            new TextEncoder().encode("get"),
            new TextEncoder().encode(key)
        ];
        const boxes = [{appIndex: this.appId, name: new TextEncoder().encode(key)}];

        try {
            await this.sendTransaction(appArgs, boxes);
            const boxResponse = await this.client.getApplicationBoxByName(this.appId, new TextEncoder().encode(key)).do();
            return boxResponse.value;
        } catch (error: any) {
            if (error.message.includes("box not found")) {
                return undefined;
            }
            throw error;
        }
    }

    async ls(): Promise<string[]> {
        const appArgs = [new TextEncoder().encode("ls")];
        await this.sendTransaction(appArgs);

        const boxNames: string[] = [];
        let nextToken = "";

        do {
            const request = this.client.getApplicationBoxes(this.appId);
            request.query.next = nextToken;
            const response = await request.do();
            for (const box of response.boxes) {
                boxNames.push(new TextDecoder().decode(box.name));
            }
            nextToken = response.attribute_map['next-token']; // CHECK IF IT IS WORKING
        } while (nextToken);

        return boxNames;
    }

    async clear(): Promise<void> {
        const appArgs = [new TextEncoder().encode("clear")];
        await this.sendTransaction(appArgs);
    }

    private async sendTransaction(
        appArgs: Uint8Array[],
        boxes?: { appIndex: number; name: Uint8Array }[]
    ): Promise<void> {
        const suggestedParams = await this.client.getTransactionParams().do();

        const txn = algosdk.makeApplicationNoOpTxn(
            this.senderAccount.addr,
            suggestedParams,
            this.appId,
            appArgs,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            boxes
        );

        const signedTxn = txn.signTxn(this.senderAccount.sk);
        await this.client.sendRawTransaction(signedTxn).do();
        await algosdk.waitForConfirmation(this.client, txn.txID(), 4);
    }
}

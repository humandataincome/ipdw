import algosdk, {Account} from 'algosdk';

import {StorageProvider} from "./";
import {ReadWriteLock, withWriteLock} from "../../";

import crypto from 'crypto';

import Debug from "debug";
import {Buffer} from "buffer";

const debug = Debug('ipdw:algorand')

export const ALGORAND_TESTNET_SERVER_URL = 'https://testnet-api.algonode.cloud';
export const ALGORAND_TESTNET_INDEXER_URL = 'https://testnet-idx.algonode.cloud';

export const ALGORAND_MAINNET_SERVER_URL = 'https://mainnet-api.algonode.cloud';
export const ALGORAND_MAINNET_INDEXER_URL = 'https://mainnet-idx.algonode.cloud';

export const ALGORAND_DEFAULT_CONTRACT_NAME = '__ipdw__';

export const ALGORAND_STORAGE_APPROVAL_CODE = 'I3ByYWdtYSB2ZXJzaW9uIDEwCnR4biBBcHBsaWNhdGlvbklECmludCAwCj09CmJueiBtYWluX2wxNAp0eG4gT25Db21wbGV0aW9uCmludCBOb09wCj09CmJueiBtYWluX2wxMQp0eG4gT25Db21wbGV0aW9uCmludCBEZWxldGVBcHBsaWNhdGlvbgo9PQpibnogbWFpbl9sMTAKdHhuIE9uQ29tcGxldGlvbgppbnQgVXBkYXRlQXBwbGljYXRpb24KPT0KYm56IG1haW5fbDkKdHhuIE9uQ29tcGxldGlvbgppbnQgT3B0SW4KPT0KYm56IG1haW5fbDgKdHhuIE9uQ29tcGxldGlvbgppbnQgQ2xvc2VPdXQKPT0KYm56IG1haW5fbDcKZXJyCm1haW5fbDc6CmludCAxCnJldHVybgptYWluX2w4OgppbnQgMQpyZXR1cm4KbWFpbl9sOToKaW50IDEKcmV0dXJuCm1haW5fbDEwOgppbnQgMQpyZXR1cm4KbWFpbl9sMTE6CnR4bmEgQXBwbGljYXRpb25BcmdzIDAKYnl0ZSAic2V0Igo9PQpibnogbWFpbl9sMTMKZXJyCm1haW5fbDEzOgpjYWxsc3ViIHNldHZhbHVlXzAKcmV0dXJuCm1haW5fbDE0OgpieXRlICJuYW1lIgp0eG5hIEFwcGxpY2F0aW9uQXJncyAwCmFwcF9nbG9iYWxfcHV0CmludCAxCnJldHVybgoKLy8gc2V0X3ZhbHVlCnNldHZhbHVlXzA6CnByb3RvIDAgMQp0eG5hIEFwcGxpY2F0aW9uQXJncyAxCmJveF9sZW4Kc3RvcmUgMQpzdG9yZSAwCmxvYWQgMQpibnogc2V0dmFsdWVfMF9sNApzZXR2YWx1ZV8wX2wxOgp0eG5hIEFwcGxpY2F0aW9uQXJncyAyCmJ5dGUgIiIKPT0KYm56IHNldHZhbHVlXzBfbDMKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQp0eG5hIEFwcGxpY2F0aW9uQXJncyAyCmxlbgpib3hfY3JlYXRlCnBvcAp0eG5hIEFwcGxpY2F0aW9uQXJncyAxCnR4bmEgQXBwbGljYXRpb25BcmdzIDIKYm94X3B1dAppbnQgMQpiIHNldHZhbHVlXzBfbDUKc2V0dmFsdWVfMF9sMzoKaW50IDEKYiBzZXR2YWx1ZV8wX2w1CnNldHZhbHVlXzBfbDQ6CnR4bmEgQXBwbGljYXRpb25BcmdzIDEKYm94X2RlbApwb3AKYiBzZXR2YWx1ZV8wX2wxCnNldHZhbHVlXzBfbDU6CnJldHN1Yg==';
export const ALGORAND_STORAGE_CLEAR_CODE = 'I3ByYWdtYSB2ZXJzaW9uIDEwCmludCAxCnJldHVybg==';
export const ALGORAND_TOKEN_UNIT = 1000000n;

export class AlgorandStorageProvider implements StorageProvider {
    private rwLock = new ReadWriteLock();

    private account: algosdk.Account;
    private applicationId: bigint;
    private readonly client: algosdk.Algodv2;
    private readonly contractName: string;

    constructor(account: Account, applicationId: bigint, contractName: string, client: algosdk.Algodv2) {
        this.account = account;
        this.applicationId = applicationId;
        this.contractName = contractName;
        this.client = client;
    }

    public static async Init(privateKey: string, serverUrl: string = ALGORAND_MAINNET_SERVER_URL, indexerUrl: string = ALGORAND_MAINNET_INDEXER_URL, contractName: string = ALGORAND_DEFAULT_CONTRACT_NAME): Promise<AlgorandStorageProvider> {
        const client = new algosdk.Algodv2('', serverUrl, 443);
        const indexer = new algosdk.Indexer('', indexerUrl, 443);

        const account = algosdk.mnemonicToSecretKey(algosdk.secretKeyToMnemonic(Buffer.from(privateKey.slice(2), 'hex')));
        debug('ALGO Address is', account.addr);

        let resApplicationId: bigint | undefined = undefined;
        let nextToken: string | undefined = '';
        do {
            // We can also use client.accountInformation too because it contains created-apps key
            const response = await indexer.searchForApplications()
                .creator(account.addr)
                .nextToken(nextToken)
                .do();

            for (const app of response.applications) {
                const globalState = app.params.globalState!;
                const nameKey = Buffer.from("name").toString('base64');
                const nameValue = globalState.find((item: any) => item.key === nameKey);

                if (nameValue && Buffer.from(nameValue.value.bytes).toString('utf8') === contractName) {
                    resApplicationId = app.id;
                    break;
                }
            }

            nextToken = response.nextToken;
        } while (nextToken);

        return new AlgorandStorageProvider(account, resApplicationId!, contractName, client);
    }

    public async setup() {
        const accountInfo = await this.client.accountInformation(this.account.addr).do();

        const balance = accountInfo.amount / ALGORAND_TOKEN_UNIT;
        debug('ALGO Balance is', balance);
        if (balance < 4) // 0.001 ALGO just for deploy
            throw Error('Keep at least 4 ALGO on the wallet');

        if (this.applicationId === undefined) {
            const appArgs = [
                new TextEncoder().encode(this.contractName)
            ];

            const compiledApprovalProgram = await this.client.compile(Buffer.from(ALGORAND_STORAGE_APPROVAL_CODE, 'base64')).do();
            const compiledClearProgram = await this.client.compile(Buffer.from(ALGORAND_STORAGE_CLEAR_CODE, 'base64')).do();
            const suggestedParams = await this.client.getTransactionParams().do();

            const txn = algosdk.makeApplicationCreateTxnFromObject({
                sender: this.account.addr,
                suggestedParams: suggestedParams,
                onComplete: algosdk.OnApplicationComplete.NoOpOC,
                approvalProgram: new Uint8Array(Buffer.from(compiledApprovalProgram.result, "base64")),
                clearProgram: new Uint8Array(Buffer.from(compiledClearProgram.result, "base64")),
                numLocalInts: 1,
                numLocalByteSlices: 1,
                numGlobalInts: 1,
                numGlobalByteSlices: 1,
                appArgs: appArgs
            });

            const signedTxn = txn.signTxn(this.account.sk);
            const {txid} = await this.client.sendRawTransaction(signedTxn).do();
            const confirmedTxn = await algosdk.waitForConfirmation(this.client, txid, 4);

            this.applicationId = confirmedTxn.applicationIndex!;
            debug("Created Application ID:", this.applicationId);
        }

        const applicationAddress = algosdk.getApplicationAddress(this.applicationId!);
        const applicationAccountInfo = await this.client.accountInformation(applicationAddress).do();
        const applicationBalance = applicationAccountInfo.amount / ALGORAND_TOKEN_UNIT;
        debug('Application ALGO Balance is', applicationBalance);
        if (applicationBalance < 1) {
            const totalCost = 3n * ALGORAND_TOKEN_UNIT;
            const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                sender: this.account.addr,
                receiver: applicationAddress,
                amount: totalCost,
                suggestedParams: await this.client.getTransactionParams().do(),
            })

            const signedTxn = txn.signTxn(this.account.sk);
            const {txid} = await this.client.sendRawTransaction(signedTxn).do();
            await algosdk.waitForConfirmation(this.client, txid, 4);
        }
    }

    private static hashKey(key: string): Uint8Array {
        return new Uint8Array(crypto.createHash('sha512').update(key).digest());
    }

    private static encodeValue(key: string, value: Uint8Array | undefined): Uint8Array {
        if (value === undefined) {
            return new Uint8Array(0);
        }
        const buffer = Buffer.alloc(2 + key.length + value.length);
        buffer.writeUInt16BE(key.length, 0);
        buffer.fill(Buffer.from(key, 'utf8'), 2);
        buffer.fill(value, 2 + key.length);

        return new Uint8Array(buffer);
    }

    private static decodeValue(encodedValue: Uint8Array): { key: string, value: Uint8Array } {
        const buffer = Buffer.from(encodedValue);

        const keyLength = buffer.subarray(0, 2).readUInt16BE(0);
        const key = buffer.subarray(2, 2 + keyLength).toString('utf8');
        const value = buffer.subarray(2 + keyLength, buffer.length);

        return {key, value};
    }

    public async getAccountInfo(): Promise<{ address: string, mnemonic: string, balance: bigint }> {
        const accountInfo = await this.client.accountInformation(this.account.addr).do();
        return {address: this.account.addr.toString(), mnemonic: algosdk.secretKeyToMnemonic(this.account.sk), balance: accountInfo.amount};
    }

    @withWriteLock(function (this: AlgorandStorageProvider) {
        return this.rwLock;
    })
    public async set(key: string, value: Uint8Array | undefined): Promise<void> {
        const hashedKey = AlgorandStorageProvider.hashKey(key);
        const encodedValue = AlgorandStorageProvider.encodeValue(key, value);

        const txn = algosdk.makeApplicationNoOpTxnFromObject({
            sender: this.account.addr,
            appIndex: this.applicationId,
            appArgs: [new Uint8Array(Buffer.from('set')), hashedKey, encodedValue],
            suggestedParams: await this.client.getTransactionParams().do(),
            boxes: [{name: hashedKey, appIndex: this.applicationId}]
        });

        const signedTxn = txn.signTxn(this.account.sk);
        const {txid} = await this.client.sendRawTransaction(signedTxn).do();
        await algosdk.waitForConfirmation(this.client, txid, 4);
    }

    public async has(key: string): Promise<boolean> {
        const value = await this.get(key);
        return value !== undefined;
    }

    public async get(key: string): Promise<Uint8Array | undefined> {
        try {
            const hashedKey = AlgorandStorageProvider.hashKey(key);
            const boxResponse = await this.client.getApplicationBoxByName(this.applicationId, hashedKey).do();
            const decodedValue = AlgorandStorageProvider.decodeValue(boxResponse.value);

            if (decodedValue.key !== key) {
                debug(`Hash collision detected: ${key} vs ${decodedValue.key}`);
                return undefined;
            }

            return decodedValue.value;
        } catch (e: any) {
            if (e.message.includes('box not found')) {
                return undefined;
            }
            throw e;
        }
    }

    public async ls(): Promise<string[]> {
        const boxes = await this.client.getApplicationBoxes(this.applicationId).do();
        const keys: string[] = [];

        for (const box of boxes.boxes) {
            try {
                const boxResponse = await this.client.getApplicationBoxByName(this.applicationId, box.name).do();
                const decodedValue = AlgorandStorageProvider.decodeValue(boxResponse.value);
                keys.push(decodedValue.key);
            } catch (e: any) {
                debug(`Error decoding box: ${e.message}`);
            }
        }

        return keys;
    }

    @withWriteLock(function (this: AlgorandStorageProvider) {
        return this.rwLock;
    })
    public async clear(): Promise<void> {
        // Here we can also delete the app and clear user state
        const boxes = await this.client.getApplicationBoxes(this.applicationId).do();

        for (const box of boxes.boxes) {
            const txn = algosdk.makeApplicationNoOpTxnFromObject({
                sender: this.account.addr,
                appIndex: this.applicationId,
                appArgs: [new Uint8Array(Buffer.from('set')), box.name, new Uint8Array(0)],
                suggestedParams: await this.client.getTransactionParams().do(),
                boxes: [{name: box.name, appIndex: this.applicationId}]
            });

            const signedTxn = txn.signTxn(this.account.sk);
            const {txid} = await this.client.sendRawTransaction(signedTxn).do();
            await algosdk.waitForConfirmation(this.client, txid, 4);
        }
    }

}

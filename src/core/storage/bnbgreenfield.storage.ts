import {bytesFromBase64, Client, Long, RedundancyType, TxResponse, VisibilityType} from '@bnb-chain/greenfield-js-sdk';
import {ReedSolomon} from "@bnb-chain/reed-solomon";

import * as web3 from 'web3';

import {StorageProvider} from "./";
import {Buffer} from "buffer";
import {DeliverTxResponse} from "@cosmjs/stargate";

// https://testnet.dcellar.io/buckets

export const GREENFIELD_CHAIN_RPC_URL = (globalThis.localStorage?.WEB_ENV || process?.env.NODE_ENV) === 'dev' ? 'https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org' : 'https://greenfield-chain.bnbchain.org';
export const GREENFIELD_CHAIN_ID = (globalThis.localStorage?.WEB_ENV || process?.env.NODE_ENV) === 'dev' ? 5600 : 1017;
export const GREENFIELD_BUCKET_NAME = 'ipdw-v1';

export class BNBGreenfieldStorageProvider implements StorageProvider {
    private readonly privateKey: string;
    private readonly address: string;
    private readonly bucketName: string;
    private readonly spEndpoint: string;
    private client: Client;

    constructor(privateKey: string, address: string, bucketName: string, spEndpoint: string, client: Client) {
        this.privateKey = privateKey;
        this.address = address;
        this.bucketName = bucketName;
        this.spEndpoint = spEndpoint;
        this.client = client;
    }

    public static async Init(privateKey: string): Promise<BNBGreenfieldStorageProvider> {
        const client = Client.create(GREENFIELD_CHAIN_RPC_URL, GREENFIELD_CHAIN_ID.toString());

        const sps = await client.sp.getStorageProviders();
        const sortedSps = sps.sort((a, b) => a.id - b.id);
        const primarySP = sortedSps[0];

        const address = web3.eth.accounts.privateKeyToAccount(privateKey).address;

        const balance = await client.account.getAccountBalance({
            address: address,
            denom: 'BNB',
        });

        if (BigInt(balance.balance!.amount) < 10 ** (18 - 2)) {
            throw Error('Keep at least 0.01 BNB on the wallet on Greenfield network, use https://greenfield.bnbchain.org/en/bridge?type=transfer-in');
        }

        const bucketName = GREENFIELD_BUCKET_NAME;

        const quota = await client.bucket.getBucketReadQuota({
            bucketName: bucketName
        }, {
            type: 'ECDSA',
            privateKey: privateKey,
        });

        if (quota.body) {
            const availableQuota = (quota.body!.freeQuota - quota.body!.freeConsumedSize) + (quota.body!.readQuota - quota.body!.consumedQuota) + (quota.body!.monthlyFreeQuota - quota.body!.monthlyQuotaConsumedSize);
            if (availableQuota < 1024 * 1024 * 128) { // 128 Mb
                const updateBucketTx = await client.bucket.updateBucketInfo({
                    bucketName: bucketName,
                    operator: address,
                    chargedReadQuota: Long.fromNumber(1024 * 1024 * 512).toString(), // 512 Mb
                    visibility: VisibilityType.VISIBILITY_TYPE_PRIVATE,
                    paymentAddress: address,
                });
                await BNBGreenfieldStorageProvider.SendTransaction(updateBucketTx, privateKey);
            }
        } else {
            const createBucketTx = await client.bucket.createBucket({
                    bucketName: bucketName,
                    creator: address,
                    visibility: VisibilityType.VISIBILITY_TYPE_PRIVATE,
                    chargedReadQuota: Long.fromNumber(1024 * 1024 * 512), // 512 Gb
                    primarySpAddress: primarySP.operatorAddress,
                    paymentAddress: address,
                },
            );
            await BNBGreenfieldStorageProvider.SendTransaction(createBucketTx, privateKey);
        }

        return new BNBGreenfieldStorageProvider(privateKey, address, bucketName, primarySP.endpoint, client);
    }

    private static async SendTransaction(transaction: TxResponse, privateKey: string): Promise<DeliverTxResponse> {
        const address = web3.eth.accounts.privateKeyToAccount(privateKey).address;

        const simulateInfo = await transaction.simulate({
            denom: 'BNB',
        });
        return await transaction.broadcast({
            denom: 'BNB',
            gasLimit: Number(simulateInfo?.gasLimit),
            gasPrice: simulateInfo?.gasPrice || '5000000000',
            payer: address,
            granter: '',
            privateKey: privateKey
        });
    }

    async set(key: string, value: Uint8Array | undefined): Promise<void> {
        if (!value) {
            const deleteObjectTx = await this.client.object.deleteObject({
                bucketName: this.bucketName,
                objectName: key,
                operator: this.address
            });

            await BNBGreenfieldStorageProvider.SendTransaction(deleteObjectTx, this.privateKey);
        } else {
            if (await this.has(key))
                await this.set(key, undefined);

            const createObjectTx = await this.client.object.createObject({
                bucketName: this.bucketName,
                objectName: key,
                creator: this.address,
                visibility: VisibilityType.VISIBILITY_TYPE_PRIVATE,
                contentType: 'application/octet-stream',
                redundancyType: RedundancyType.REDUNDANCY_EC_TYPE,
                payloadSize: Long.fromInt(value.length),
                expectChecksums: new ReedSolomon().encode(value).map((x) => bytesFromBase64(x)),
            });

            await BNBGreenfieldStorageProvider.SendTransaction(createObjectTx, this.privateKey);

            await this.client.object.uploadObject({
                bucketName: this.bucketName,
                objectName: key,
                body: {
                    name: key,
                    type: 'application/octet-stream',
                    size: value.length,
                    content: Buffer.from(value),
                },
                endpoint: this.spEndpoint
            }, {
                type: 'ECDSA',
                privateKey: this.privateKey,
            });
        }
    }

    async has(key: string): Promise<boolean> {
        try {
            await this.client.object.headObject(this.bucketName, key);
            return true;
        } catch (e: any) {
            if (e.message.includes('No such object')) {
                return false;
            }
            throw e;
        }
    }

    async get(key: string): Promise<Uint8Array | undefined> {
        const response = await this.client.object.getObject({
            bucketName: this.bucketName,
            objectName: key,
            endpoint: this.spEndpoint
        }, {
            type: 'ECDSA',
            privateKey: this.privateKey,
        });

        if (!response.body)
            return undefined;

        return new Uint8Array(await response.body.arrayBuffer());
    }

    async ls(): Promise<string[]> {
        const response = await this.client.object.listObjects({
            bucketName: this.bucketName,
            endpoint: this.spEndpoint
        });

        if (!response.body)
            return [];
        return response.body.GfSpListObjectsByBucketNameResponse.Objects.map(obj => obj.ObjectInfo.ObjectName);
    }

    async clear(): Promise<void> {
        const objects = await this.ls();
        await Promise.all(objects.map(objectName => this.set(objectName, undefined)));
    }
}

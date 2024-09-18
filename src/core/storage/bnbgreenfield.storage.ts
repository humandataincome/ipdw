import {bytesFromBase64, Client, Long, RedundancyType, TxResponse, VisibilityType} from '@bnb-chain/greenfield-js-sdk';
import {ReedSolomon} from "@bnb-chain/reed-solomon";

import * as web3 from 'web3';

import {StorageProvider} from "./";

import {DeliverTxResponse} from "@cosmjs/stargate";
import {ReadWriteLock, withReadLock, withWriteLock} from "../../utils";

export const GREENFIELD_TESTNET_CHAIN_RPC_URL = 'https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org';
export const GREENFIELD_TESTNET_CHAIN_ID = 5600;

export const GREENFIELD_MAINNET_CHAIN_RPC_URL = 'https://greenfield-chain.bnbchain.org';
export const GREENFIELD_MAINNET_CHAIN_ID = 1017;

export const GREENFIELD_DEFAULT_BUCKET_NAME = '0--ipdw--0'; // Underscore not supported

export class BNBGreenfieldStorageProvider implements StorageProvider {
    private rwLock = new ReadWriteLock();

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

    public static async Init(privateKey: string, rpcUrl: string = GREENFIELD_MAINNET_CHAIN_RPC_URL, chainId: number = GREENFIELD_MAINNET_CHAIN_ID, bucketName: string = GREENFIELD_DEFAULT_BUCKET_NAME): Promise<BNBGreenfieldStorageProvider> {
        const client = Client.create(rpcUrl, chainId.toString());

        const sps = await client.sp.getStorageProviders();
        const sortedSps = sps.sort((a, b) => a.id - b.id);
        const primarySP = sortedSps[0];

        const address = web3.eth.accounts.privateKeyToAccount(privateKey).address;

        const balance = await client.account.getAccountBalance({
            address: address,
            denom: 'BNB',
        });

        // To check buckets go to https://testnet.dcellar.io/buckets

        if (BigInt(balance.balance!.amount) < 10 ** (18 - 2)) {
            throw Error('Keep at least 0.01 BNB on the wallet on Greenfield network, use https://greenfield.bnbchain.org/en/bridge?type=transfer-in');
        }

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

    public async getAccountInfo(): Promise<{ address: string, balance: bigint }> {
        const balance = await this.client.account.getAccountBalance({address: this.address, denom: 'BNB'});
        return {address: this.address, balance: BigInt(balance.balance!.amount)};
    }

    @withWriteLock(function (this: BNBGreenfieldStorageProvider) {
        return this.rwLock;
    })
    public async set(key: string, value: Uint8Array | undefined): Promise<void> {
        if (!value) {
            const deleteObjectTx = await this.client.object.deleteObject({
                bucketName: this.bucketName,
                objectName: key,
                operator: this.address
            });

            await BNBGreenfieldStorageProvider.SendTransaction(deleteObjectTx, this.privateKey);
        } else {
            if (await this.has(key)) {
                const deleteObjectTx = await this.client.object.deleteObject({
                    bucketName: this.bucketName,
                    objectName: key,
                    operator: this.address
                });

                await BNBGreenfieldStorageProvider.SendTransaction(deleteObjectTx, this.privateKey);
            }

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

    public async has(key: string): Promise<boolean> {
        try {
            await this.client.object.headObject(this.bucketName, key);
            return true;
        } catch (e: any) {
            return false;
        }
    }

    @withReadLock(function (this: BNBGreenfieldStorageProvider) {
        return this.rwLock;
    })
    public async get(key: string): Promise<Uint8Array | undefined> {
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

    public async ls(): Promise<string[]> {
        const response = await this.client.object.listObjects({
            bucketName: this.bucketName,
            endpoint: this.spEndpoint
        });

        if (!response.body)
            return [];
        return response.body.GfSpListObjectsByBucketNameResponse.Objects.map(obj => obj.ObjectInfo.ObjectName);
    }

    public async clear(): Promise<void> {
        // Here we can also delete the bucket
        const objects = await this.ls();
        await Promise.all(objects.map(objectName => this.set(objectName, undefined)));
    }
}

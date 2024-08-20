import {DdcClient, File, FileUri, Signer} from '@cere-ddc-sdk/ddc-client';
import {CnsRecord, NodeInterface} from '@cere-ddc-sdk/ddc';
import {StorageProvider} from "./";
import {Blockchain} from "@cere-ddc-sdk/blockchain";
import {Bucket} from "@cere-ddc-sdk/blockchain/src/types";

import Debug from "debug";

const debug = Debug('ipdw:cere')

export const CERE_TESTNET_RPC_URL = 'wss://rpc.testnet.cere.network/ws';
export const CERE_TESTNET_INDEXER_URL = 'https://subsquid.testnet.cere.network/graphql';

export const CERE_MAINNET_RPC_URL = 'wss://rpc.mainnet.cere.network/ws';
export const CERE_MAINNET_INDEXER_URL = 'https://subsquid.cere.network/graphql';

export const CERE_DEFAULT_BUCKET_NAME = '__ipdw__';

export const CERE_TOKEN_UNIT = 10_000_000_000n;

export class CereStorageProvider implements StorageProvider {
    private ddcClient: DdcClient;
    private ddcNode: NodeInterface;
    private readonly bucketId: bigint;

    private constructor(ddcClient: DdcClient, ddcNode: NodeInterface, bucketId: bigint) {
        this.ddcClient = ddcClient;
        this.ddcNode = ddcNode;
        this.bucketId = bucketId;
    }

    public static async Init(privateKey: string, rpcUrl: string = CERE_MAINNET_RPC_URL, indexerUrl: string = CERE_MAINNET_INDEXER_URL, bucketName: string = CERE_DEFAULT_BUCKET_NAME): Promise<CereStorageProvider> {
        const ddcClient = await DdcClient.create(privateKey, {blockchain: rpcUrl});
        const ddcNode = ((<any>ddcClient).ddcNode as NodeInterface);
        const blockchain = ((<any>ddcClient).blockchain as Blockchain);
        //const api = ((<any>blockchain).api as ApiPromise);
        const signer = ((<any>ddcClient).signer as Signer);
        debug('CERE Address is', signer.address);

        // To get started go to https://docs.cere.network/ddc/developer-guide/setup

        const clusters = await blockchain.ddcClusters.listClusters();
        const selectedCluster = clusters[0];

        const buckets = await this.GetBucketList(indexerUrl, signer.address);

        let resBucketId = 0n;
        for (let bucket of buckets) {
            const bucketNameCnsResponse = await ddcNode.getCnsRecord(bucket.bucketId, '__name__', {cacheControl: 'no-cache'});
            if (!bucketNameCnsResponse) continue;
            const bucketNameFileResponse = await ddcClient.read(new FileUri(bucket.bucketId, bucketNameCnsResponse.cid));
            const gotBucketName = await bucketNameFileResponse.text();
            if (gotBucketName === bucketName) {
                resBucketId = bucket.bucketId;
                debug('Bucket found with id', resBucketId);
                break;
            }
        }
        const deposit = await ddcClient.getDeposit();

        if (deposit < 1n * CERE_TOKEN_UNIT) {
            const balance = await ddcClient.getBalance();
            if (balance < 5n * CERE_TOKEN_UNIT)
                throw Error('Keep at least 5 CERE on the wallet, they will be automatically deposited for storage when needed. Use https://bridge.cere.network/transfer');

            await ddcClient.depositBalance(5n * CERE_TOKEN_UNIT);
        }

        if (resBucketId === 0n) {
            resBucketId = await ddcClient.createBucket(selectedCluster.clusterId, {isPublic: false});
            debug('Bucket created with id', resBucketId)
            const bucketNameFileUri = await ddcClient.store(resBucketId, new File(new TextEncoder().encode(bucketName)))
            await ddcNode.storeCnsRecord(resBucketId, new CnsRecord(bucketNameFileUri.cid, '__name__'));
        }

        return new CereStorageProvider(ddcClient, ddcNode, resBucketId);
    }

    private static async GetBucketList(indexerUrl: string, ownerId: string): Promise<any> {
        const body = JSON.stringify({
            query: `query { ddcBuckets(where: { ownerId: { id_eq: "${ownerId}" } }) { id ownerId { id } clusterId { id } isPublic isRemoved } }`
        });

        const response = await fetch(indexerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        });

        return (await response.json()).data.ddcBuckets.map((b: any) => b == null ? undefined : ({bucketId: b.bucketId, ownerId: b.ownerId.id, clusterId: b.clusterId.id, isPublic: b.isPublic, isRemoved: b.isRemoved} as Bucket));
    }

    public async getAccountInfo(): Promise<{ address: string, balance: bigint }> {
        const signer = ((<any>this.ddcClient).signer as Signer);
        const deposit = await this.ddcClient.getDeposit();
        return {address: signer.address, balance: deposit};
    }

    public async set(key: string, value: Uint8Array | undefined): Promise<void> {
        const index = await this.getIndex();

        if (value === undefined) {
            if (index[key]) {
                delete index[key];
            }
        } else {
            const file = new File(value);
            const fileUri = await this.ddcClient.store(this.bucketId, file);
            index[key] = fileUri.cid;
        }

        await this.updateIndex(index);
    }

    public async has(key: string): Promise<boolean> {
        const index = await this.getIndex();
        return !!index[key];
    }

    public async get(key: string): Promise<Uint8Array | undefined> {
        const index = await this.getIndex();
        if (!index[key]) return undefined;

        try {
            const fileResponse = await this.ddcClient.read(new FileUri(this.bucketId, index[key]));
            return new Uint8Array(await fileResponse.arrayBuffer());
        } catch (error) {
            console.error(`Error reading file for key ${key}:`, error);
            return undefined;
        }
    }

    public async ls(): Promise<string[]> {
        const index = await this.getIndex();
        return Object.keys(index);
    }

    public async clear(): Promise<void> {
        await this.updateIndex({});
    }

    private async getIndex(): Promise<Record<string, string>> {
        const indexCnsResponse = await this.ddcNode.getCnsRecord(this.bucketId, '__index__', {cacheControl: 'no-cache'});
        if (!indexCnsResponse)
            return {};

        try {
            const indexFileResponse = await this.ddcClient.read(new FileUri(this.bucketId, indexCnsResponse.cid));
            return JSON.parse(await indexFileResponse.text());
        } catch (error) {
            console.error("Error reading index file:", error);
            return {};
        }
    }

    private async updateIndex(index: Record<string, string>): Promise<void> {
        const indexFile = new File(new TextEncoder().encode(JSON.stringify(index)));
        const indexFileUri = await this.ddcClient.store(this.bucketId, indexFile);
        await this.ddcNode.storeCnsRecord(this.bucketId, new CnsRecord(indexFileUri.cid, '__index__'));
    }
}

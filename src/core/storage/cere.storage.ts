import {DdcClient, File, FileUri, MAINNET, Signer, TESTNET} from '@cere-ddc-sdk/ddc-client';
import {CnsRecord, NodeInterface} from '@cere-ddc-sdk/ddc';
import {StorageProvider} from "./";
import {Blockchain} from "@cere-ddc-sdk/blockchain";
import {Bucket} from "@cere-ddc-sdk/blockchain/src/types";

//https://docs.cere.network/ddc/developer-guide/setup

export const CERE_CONFIG = (globalThis.localStorage?.WEB_ENV || process?.env.NODE_ENV) === 'dev' ? TESTNET : MAINNET;
export const CERE_TOKEN_UNIT = 10_000_000_000n;
export const CERE_INDEXER_URL = (globalThis.localStorage?.WEB_ENV || process?.env.NODE_ENV) === 'dev' ? 'https://subsquid.testnet.cere.network/graphql' : 'https://subsquid.cere.network/graphql';

export class CereStorageProvider implements StorageProvider {
    private ddcClient: DdcClient;
    private ddcNode: NodeInterface;
    private readonly bucketId: bigint;

    private constructor(ddcClient: DdcClient, ddcNode: NodeInterface, bucketId: bigint) {
        this.ddcClient = ddcClient;
        this.ddcNode = ddcNode;
        this.bucketId = bucketId;
    }

    public static async Init(privateKey: string): Promise<CereStorageProvider> {
        const ddcClient = await DdcClient.create(privateKey, CERE_CONFIG);
        const ddcNode = ((<any>ddcClient).ddcNode as NodeInterface);
        const blockchain = ((<any>ddcClient).blockchain as Blockchain);
        //const api = ((<any>blockchain).api as ApiPromise);
        const signer = ((<any>ddcClient).signer as Signer);
        console.log('CERE Address is', signer.address);

        const clusters = await blockchain.ddcClusters.listClusters();
        const selectedCluster = clusters[0];

        const buckets = await this.GetBucketList(signer.address);

        let resBucketId = 0n;
        for (let bucket of buckets) {
            const bucketNameCnsResponse = await ddcNode.getCnsRecord(bucket.bucketId, '__name__');
            if (!bucketNameCnsResponse) continue;
            const bucketNameFileResponse = await ddcClient.read(new FileUri(bucket.bucketId, bucketNameCnsResponse.cid));
            const bucketName = await bucketNameFileResponse.text();
            if (bucketName === '__ipdw__') {
                resBucketId = bucket.bucketId;
                console.log('Bucket found with id', resBucketId);
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
            console.log('Bucket created with id', resBucketId)
            const bucketNameFileUri = await ddcClient.store(resBucketId, new File(new TextEncoder().encode("__ipdw__")))
            await ddcNode.storeCnsRecord(resBucketId, new CnsRecord(bucketNameFileUri.cid, '__name__'));
        }

        return new CereStorageProvider(ddcClient, ddcNode, resBucketId);
    }

    public static async GetBucketList(ownerId: string): Promise<any> {
        const body = JSON.stringify({
            query: `query { ddcBuckets(where: { ownerId: { id_eq: "${ownerId}" } }) { bucketId ownerId { id } clusterId { id } isPublic isRemoved } }`
        });

        const response = await fetch(CERE_INDEXER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        });


        return (await response.json()).data.ddcBuckets.map((b: any) => b == null ? undefined : ({bucketId: b.bucketId, ownerId: b.ownerId.id, clusterId: b.clusterId.id, isPublic: b.isPublic, isRemoved: b.isRemoved} as Bucket));
    }

    async set(key: string, value: Uint8Array | undefined): Promise<void> {
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

    async has(key: string): Promise<boolean> {
        const index = await this.getIndex();
        return !!index[key];
    }

    async get(key: string): Promise<Uint8Array | undefined> {
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

    async ls(): Promise<string[]> {
        const index = await this.getIndex();
        return Object.keys(index);
    }

    async clear(): Promise<void> {
        await this.updateIndex({});
    }

    private async getIndex(): Promise<Record<string, string>> {
        const indexCnsResponse = await this.ddcNode.getCnsRecord(this.bucketId, '__index__');
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

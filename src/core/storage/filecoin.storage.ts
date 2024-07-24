/*
import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { CID } from 'multiformats/cid';
import { Lotus } from '@filecoin-shipyard/lotus-client-rpc';
import { NodejsProvider } from '@filecoin-shipyard/lotus-client-provider-nodejs';
import { mainnet } from '@filecoin-shipyard/lotus-client-schema';

import {StorageProvider} from "./";

export class FilecoinStorageProvider implements StorageProvider {
    private ipfs: IPFSHTTPClient;
    private lotus: Lotus;
    private ipnsKey: string;
    private rootCID: CID | null = null;

    constructor(ipfsApiUrl: string, lotusApiUrl: string, ipnsKeyName: string) {
        this.ipfs = create({ url: ipfsApiUrl });
        const provider = new NodejsProvider(lotusApiUrl);
        this.lotus = new Lotus(provider, { schema: mainnet.fullNode });
        this.ipnsKey = ipnsKeyName;
    }

    private async initializeIPNS(): Promise<void> {
        // Check if the key already exists
        const keys = await this.ipfs.key.list();
        const existingKey = keys.find(k => k.name === this.ipnsKey);

        if (!existingKey) {
            // If the key doesn't exist, create it
            await this.ipfs.key.gen(this.ipnsKey, {
                type: 'rsa',
                size: 2048
            });
        }

        // Try to resolve the existing IPNS name
        try {
            const resolvedCID = await this.ipfs.name.resolve(`/ipns/${this.ipnsKey}`);
            this.rootCID = CID.parse(resolvedCID.substring(6)); // Remove '/ipfs/' prefix
        } catch (error) {
            // If resolution fails, it means there's no published content yet
            console.log('No existing IPNS record found. Starting with empty state.');
            this.rootCID = null;
        }
    }

    private async updateIPNS(): Promise<void> {
        if (this.rootCID) {
            await this.ipfs.name.publish(this.rootCID, {
                key: this.ipnsKey
            });
        }
    }

    private async updateFilecoinDeal(newCID: CID): Promise<void> {
        // Here you would typically make a Filecoin deal to store the CID
        // This is a simplified version
        await this.lotus.clientStartDeal({
            Data: {
                TransferType: 'graphsync',
                Root: newCID,
            },
            Wallet: await this.lotus.walletDefaultAddress(),
            Miner: 'f01234', // Replace with an actual miner address
            EpochPrice: '2500000000', // 2.5 FIL
            MinBlocksDuration: 518400, // 180 days
        });
    }

    async set(key: string, value: Uint8Array | undefined): Promise<void> {
        if (!this.rootCID) {
            await this.initializeIPNS();
        }

        const rootObj = this.rootCID ? await this.ipfs.dag.get(this.rootCID) : {};
        if (value === undefined) {
            delete rootObj[key];
        } else {
            const cid = await this.ipfs.add(value);
            rootObj[key] = cid.cid;
        }
        this.rootCID = await this.ipfs.dag.put(rootObj);
        await this.updateIPNS();
        await this.updateFilecoinDeal(this.rootCID);
    }

    async has(key: string): Promise<boolean> {
        if (!this.rootCID) {
            await this.initializeIPNS();
        }
        if (!this.rootCID) return false;
        const rootObj = await this.ipfs.dag.get(this.rootCID);
        return key in rootObj;
    }

    async get(key: string): Promise<Uint8Array | undefined> {
        if (!this.rootCID) {
            await this.initializeIPNS();
        }
        if (!this.rootCID) return undefined;
        const rootObj = await this.ipfs.dag.get(this.rootCID);
        if (!(key in rootObj)) return undefined;
        const cid = rootObj[key];
        const chunks = [];
        for await (const chunk of this.ipfs.cat(cid)) {
            chunks.push(chunk);
        }
        return new Uint8Array(Buffer.concat(chunks));
    }

    async ls(): Promise<string[]> {
        if (!this.rootCID) {
            await this.initializeIPNS();
        }
        if (!this.rootCID) return [];
        const rootObj = await this.ipfs.dag.get(this.rootCID);
        return Object.keys(rootObj);
    }

    async clear(): Promise<void> {
        this.rootCID = null;
        await this.updateIPNS();
        // Note: We don't update the Filecoin deal here, as we can't delete data from Filecoin
        // The old data will eventually expire based on the deal duration
    }
}
*/

/*
import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { CID } from 'multiformats/cid';
import { keys } from 'libp2p-crypto';

import {StorageProvider} from "./";

export class IPFSStorageProvider implements StorageProvider {
    private ipfs: IPFSHTTPClient;
    private ipnsKey: string;
    private rootCID: CID | null = null;

    constructor(ipfsApiUrl: string, ipnsKeyName: string) {
        this.ipfs = create({ url: ipfsApiUrl });
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
    }
}
*/

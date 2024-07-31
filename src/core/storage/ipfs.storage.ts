import {create, IPFSHTTPClient} from 'ipfs-http-client';
import crypto from 'crypto';
import {StorageProvider} from "./";

export class IPFSStorageProvider implements StorageProvider {
    private ipfs: IPFSHTTPClient;
    private ipnsName: string;

    private constructor(ipfs: IPFSHTTPClient, ipnsName: string) {
        this.ipfs = ipfs;
        this.ipnsName = ipnsName;
    }

    public static async Init(ipfsApiUrl: string, seed: string, salt: string): Promise<IPFSStorageProvider> {
        const ipfs = create({url: ipfsApiUrl});

        // Derive a deterministic RSA key pair from the seed and salt
        const [privateKeyBuffer, publicKeyBuffer] = await IPFSStorageProvider.DeriveKeyPair(Buffer.from(seed), Buffer.from(salt));

        // Convert the private key buffer to PEM format
        const privateKeyPEM = privateKeyBuffer.toString('base64');
        const privateKeyPEMFormatted = `-----BEGIN PRIVATE KEY-----\n${privateKeyPEM}\n-----END PRIVATE KEY-----`;

        // Import the generated key pair into IPFS
        const keyName = 'ipfs-storage-provider-key';
        await ipfs.key.import(keyName, privateKeyPEMFormatted, seed);

        const key = await ipfs.key.list().then(keys => keys.find(k => k.name === keyName));
        if (!key) {
            throw new Error('Failed to import deterministic key');
        }

        const ipnsName = key.id;

        return new IPFSStorageProvider(ipfs, ipnsName);
    }

    public static async DeriveKeyPair(seed: Buffer, salt: Buffer): Promise<[Buffer, Buffer]> {
        const keyBuffer = await crypto.pbkdf2Sync(seed, salt, 100100, 32, 'sha256');

        keyBuffer[0] &= 248;
        keyBuffer[31] &= 127;
        keyBuffer[31] |= 64;
        const privateKeyBuffer = Buffer.concat([Buffer.from('302e020100300506032b657004220420', 'hex'), keyBuffer]);
        const privateKey = crypto.createPrivateKey({key: privateKeyBuffer, format: 'der', type: 'pkcs8'});
        const publicKey = crypto.createPublicKey(privateKey);
        const publicKeyBuffer = publicKey.export({format: 'der', type: 'spki'});
        return [privateKeyBuffer, publicKeyBuffer];
    }

    async set(key: string, value: Uint8Array | undefined): Promise<void> {
        const index = await this.getIndex();

        if (value === undefined) {
            if (index[key]) {
                delete index[key];
            }
        } else {
            const result = await this.ipfs.add(value);
            index[key] = result.cid.toString();
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
            const chunks = [];
            for await (const chunk of this.ipfs.cat(index[key])) {
                chunks.push(chunk);
            }
            return new Uint8Array(Buffer.concat(chunks));
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
        try {
            // Resolve the IPNS name to get the latest CID
            let resolvedPath = '';
            for await (const path of this.ipfs.name.resolve(this.ipnsName)) {
                resolvedPath = path;
                break; // We only need the first (and usually only) resolved path
            }

            if (!resolvedPath) {
                throw new Error('Failed to resolve IPNS name');
            }

            // Fetch the content of the index file
            const chunks = [];
            for await (const chunk of this.ipfs.cat(resolvedPath)) {
                chunks.push(chunk);
            }
            const indexContent = Buffer.concat(chunks).toString();
            return JSON.parse(indexContent);
        } catch (error) {
            console.error("Error reading index:", error);
            return {};
        }
    }

    private async updateIndex(index: Record<string, string>): Promise<void> {
        const indexContent = JSON.stringify(index);
        const file = await this.ipfs.add(indexContent);

        // Publish the new CID to IPNS
        await this.ipfs.name.publish(file.cid, {
            key: 'ipfs-storage-provider-key'
        });
    }
}

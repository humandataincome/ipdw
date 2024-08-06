import {createHelia, Helia} from 'helia';
import {IPNS, ipns} from '@helia/ipns';
import {UnixFS, unixfs} from '@helia/unixfs';
import crypto from 'crypto';
import {StorageProvider} from "./";

import util from "util";
import {CID} from "multiformats/cid";
import {PeerId} from "@libp2p/interface";
import {createFromPrivKey} from '@libp2p/peer-id-factory';
import {keys} from '@libp2p/crypto';


export const IPNS_DEFAULT_DERIVATION_SALT = Buffer.from('gAxkvMFf', 'utf8');

export class IPFSStorageProvider implements StorageProvider {
    private readonly ipnsPeerId: PeerId;

    private ipnsInstance: IPNS;
    private unixfsInstance: UnixFS;

    private constructor(ipnsPeerId: PeerId, helia: Helia) {
        this.ipnsPeerId = ipnsPeerId;
        this.ipnsInstance = ipns(helia);
        this.unixfsInstance = unixfs(helia);
    }

    public static async Init(privateKey: string, salt: Uint8Array = IPNS_DEFAULT_DERIVATION_SALT): Promise<IPFSStorageProvider> {
        // Future works: evaluate remote pinning services (@helia/remote-pinning) and http helia client (@helia/http)
        const helia = await createHelia();

        // const derivedKeyBuffer = Buffer.from(privateKey.slice(2), 'hex');
        const derivedKeyBuffer = await util.promisify(crypto.pbkdf2)(privateKey, salt, 100100, 32, 'sha256');
        const derivedPrivateKey = keys.supportedKeys.secp256k1.unmarshalSecp256k1PrivateKey(derivedKeyBuffer);

        const keyInfo = await helia.libp2p.services.keychain.importPeer('ipdw-ipns-key', await createFromPrivKey(derivedPrivateKey));
        const peerId = await helia.libp2p.services.keychain.exportPeerId(keyInfo.name);

        return new IPFSStorageProvider(peerId, helia);
    }

    async set(key: string, value: Uint8Array | undefined): Promise<void> {
        const index = await this.getIndex();

        if (value === undefined) {
            if (index[key]) {
                delete index[key];
            }
        } else {
            const result = await this.unixfsInstance.addBytes(value);
            index[key] = result.toString();
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
            for await (const chunk of this.unixfsInstance.cat(CID.parse(index[key]))) {
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
            let resolvedPath = await this.ipnsInstance.resolve(this.ipnsPeerId);

            if (!resolvedPath) {
                throw Error('Failed to resolve IPNS name');
            }

            const chunks = [];
            for await (const chunk of this.unixfsInstance.cat(resolvedPath.cid)) {
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
        const file = await this.unixfsInstance.addBytes(Buffer.from(indexContent));

        await this.ipnsInstance.publish(this.ipnsPeerId, file);
    }
}

/*
import { StorageProvider } from "./";
// @ts-ignore
import { LotusWalletProvider } from '@filecoin-shipyard/lotus-client-provider-browser';
import { LotusRPC } from '@filecoin-shipyard/lotus-client-rpc';
// @ts-ignore
import { mainnet } from '@filecoin-shipyard/lotus-client-schema';

export class FilecoinStorageProvider implements StorageProvider {
    private client: LotusRPC;
    private wallet: string;

    private constructor(client: LotusRPC, wallet: string) {
        this.client = client;
        this.wallet = wallet;
    }

    public static async Init(apiUrl: string, token: string, wallet: string): Promise<FilecoinStorageProvider> {
        const provider = new LotusWalletProvider(apiUrl, token);
        const client = new LotusRPC(provider, { schema: mainnet.fullNode });
        return new FilecoinStorageProvider(client, wallet);
    }

    private async getIndex(): Promise<Record<string, string>> {
        try {
            const indexCid = await this.client.stateLookupID(this.wallet, []);
            const indexData = await this.client.chainGetNode(indexCid);
            return JSON.parse(indexData.Obj) as Record<string, string>;
        } catch (error) {
            console.error("Error reading index:", error);
            return {};
        }
    }

    private async updateIndex(index: Record<string, string>): Promise<void> {
        const indexCid = await this.client.clientImport({ Path: JSON.stringify(index), IsCAR: false });
        await this.client.walletDefaultAddress();
    }

    async set(key: string, value: Uint8Array | undefined): Promise<void> {
        const index = await this.getIndex();

        if (value === undefined) {
            if (index[key]) {
                delete index[key];
            }
        } else {
            const cid = await this.client.clientImport({ Path: value, IsCAR: false });
            index[key] = cid['/'];
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
            const retrievalOffer = await this.client.clientFindData({ '/': index[key] }, null);
            const fileData = await this.client.clientRetrieve(retrievalOffer.Root, { Path: index[key] });
            return new Uint8Array(fileData);
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
}
*/

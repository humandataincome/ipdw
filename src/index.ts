import {E2EManager} from "./core/e2e";
import {Vault} from "./core/vault";
import {IPFSManager} from "./core/ipfs";

export class IPDW {
    private readonly token: string;
    private data: Buffer;

    constructor(token: string) {
        this.token = token;
    }

    public static async create(sign: (msg: string) => Promise<string>, nonce: string = 'Global'): Promise<IPDW> {
        // Lazy initialize IPFS node
        return new IPDW(await sign(`Login to your InterPlanetary Data Wallet (${nonce})`));
    }

    public async pull(): Promise<void> {
        const privateKey = E2EManager.generateKeyPair(this.token).privateKey;

        const ipfs = await IPFSManager.getInstance();
        this.data = Buffer.from(await ipfs.readNamed(privateKey), 'base64');
    }

    public async push(): Promise<void> {
        const privateKey = E2EManager.generateKeyPair(this.token).privateKey;

        const ipfs = await IPFSManager.getInstance();
        await ipfs.writeNamed(this.data.toString('base64'), privateKey);
    }

    public async sync(): Promise<void> {
        //TODO: update from remote is timestamp is more than local one
    }

    public async getData(type: 'RAW' | 'ENCRYPTED', nonce: string = 'Global'): Promise<Buffer> {
        switch (type) {
            case 'RAW':
                return this.data;
            case 'ENCRYPTED':
                return await Vault.unlock(this.data, `${this.token}${nonce}`);
        }
    }

    public async setData(data: Buffer, type: 'RAW' | 'ENCRYPTED', nonce: string = 'Global'): Promise<void> {
        switch (type) {
            case 'RAW':
                this.data = data;
                break;
            case 'ENCRYPTED':
                this.data = await Vault.lock(data, `${this.token}${nonce}`);
                break;
        }
    }
}

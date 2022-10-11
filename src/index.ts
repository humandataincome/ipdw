import {E2EManager} from "./core/e2e";
import {Vault} from "./core/vault";
import {IPFSManager} from "./core/ipfs";

export class IPDW {
    private readonly token: string;
    private readonly privateKey: string;
    private data: Buffer;

    constructor(token: string) {
        this.token = token;
        this.privateKey = E2EManager.generateKeyPair(this.token).privateKey;
    }

    public static async create(sign: (msg: string) => Promise<string>, nonce: string = 'Global'): Promise<IPDW> {
        // Lazy initialize IPFS node
        return new IPDW(await sign(`Login to your InterPlanetary Data Wallet (${nonce})`));
    }

    public async pull(): Promise<void> {
        const ipfs = await IPFSManager.getInstance();
        this.data = Buffer.from(await ipfs.readNamed(this.privateKey), 'base64');
    }

    public async push(): Promise<void> {
        const ipfs = await IPFSManager.getInstance();
        await ipfs.writeNamed(this.data.toString('base64'), this.privateKey);
    }

    public async sync(): Promise<void> {
        //TODO: update from remote is timestamp is more than local one
    }

    public async getData(type: 'PLAIN' | 'ENCRYPTED', nonce: string = 'Global'): Promise<Buffer> {
        switch (type) {
            case 'PLAIN':
                return this.data;
            case 'ENCRYPTED':
                return await Vault.unlock(this.data, `${this.token}${nonce}`);
        }
    }

    public async setData(data: Buffer, type: 'PLAIN' | 'ENCRYPTED', nonce: string = 'Global'): Promise<void> {
        switch (type) {
            case 'PLAIN':
                this.data = data;
                break;
            case 'ENCRYPTED':
                this.data = await Vault.lock(data, `${this.token}${nonce}`);
                break;
        }
    }

    public async addMessageListener(type: 'PLAIN' | 'ENCRYPTED', nonce: string, listener: (msg: string) => void) {
        const ipfs = await IPFSManager.getInstance();

        await ipfs.ipfs.pubsub.subscribe(nonce, (msg) => listener(msg.data.toString()))
    }

    public async removeAllMessageListeners(): Promise<void> {
        const ipfs = await IPFSManager.getInstance();
        const topics = await ipfs.ipfs.pubsub.ls();
        await Promise.all(topics.map(t => ipfs.ipfs.pubsub.unsubscribe(t)));
    }

    public async sendMessage(type: 'PLAIN' | 'ENCRYPTED', nonce: string, message: string) {
        const ipfs = await IPFSManager.getInstance();

        await ipfs.ipfs.pubsub.publish(nonce, Buffer.from(message, 'utf8'))
    }
}

import {create, IPFS} from 'ipfs-core'
import {KeyPair} from "./keypair";
import crypto from "crypto";

export class IPFSManager {
    private static instance: IPFSManager

    public node: IPFS;

    constructor(ipfs: IPFS) {
        this.node = ipfs;
    }

    public static async getInstance(): Promise<IPFSManager> {
        if (!IPFSManager.instance) {
            IPFSManager.instance = new IPFSManager(
                await create({
                    repo: 'ipfs-ipdw', //+ Math.random(),
                    config: {
                        Addresses: {
                            Swarm: [
                                "/ip4/127.0.0.1/tcp/4002",
                                "/ip4/127.0.0.1/tcp/5003/ws",
                                "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
                                "/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
                                "/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/"
                            ]
                        }
                    }
                })
            );
        }

        return IPFSManager.instance;
    }

    //TODO: switch to a buffer content instead of string
    public async write(data: string): Promise<string> {
        const {cid} = await this.node.add(data);
        return cid.toString();
    }

    public async read(cid: string): Promise<string> {
        const data = await this.node.cat(cid);
        const decoder = new TextDecoder();
        let content = "";
        for await (const chunk of data) {
            content += decoder.decode(chunk);
        }
        return content;
    }

    public async writeNamed(data: string, privateKey: string): Promise<string> {
        const cid = await this.write(data);

        const publicKey = new KeyPair(privateKey).publicKey;
        const publicKeyHash = crypto.pbkdf2Sync(publicKey, 'ipdw', 1, 32, 'sha256').toString('hex');
        if (!(await this.node.key.list()).find(e => e.name === publicKeyHash))
            await this.node.key.import(publicKeyHash, privateKey, '');

        const {name} = await this.node.name.publish(`/ipfs/${cid}`, {key: publicKeyHash})

        return name;
    }

    public async readNamed(privateKey: string): Promise<string> {
        const publicKey = new KeyPair(privateKey).publicKey;
        const publicKeyHash = crypto.pbkdf2Sync(publicKey, 'ipdw', 1, 32, 'sha256').toString('hex');
        if (!(await this.node.key.list()).find(e => e.name === publicKeyHash))
            await this.node.key.import(publicKeyHash, privateKey, '');

        const keyId = (await this.node.key.list()).find(e => e.name === publicKeyHash)!.id;

        let content = "";
        for await (const cid of this.node.name.resolve(keyId)) {
            content += await this.read(cid);
        }

        return content;
    }
}

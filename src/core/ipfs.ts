import {KeyPair} from "./keypair";
import {HashUtils} from "../utils";
import {Strings, strings} from '@helia/strings'
import {CID} from 'multiformats/cid'

import {createHelia} from 'helia'
import {base64} from "multiformats/bases/base64"
import {ipns, IPNS} from '@helia/ipns'
import {Helia} from '@helia/interface';
import {unixfs, UnixFS} from '@helia/unixfs';


export class IPFSManager {
    private static instance: IPFSManager

    public core: Helia;
    public strings: Strings;
    public names: IPNS;
    public files: UnixFS;

    constructor(core: Helia, ipfs: Strings, files: UnixFS, names: IPNS) {
        this.core = core;
        this.strings = ipfs;
        this.files = files
        this.names = names;
    }

    public static async getInstance(): Promise<IPFSManager> {
        if (!IPFSManager.instance) {
            console.log('STARTING')
            /*
            const libp2p = await createLibp2p({
                dht: kadDHT({
                    validators: {
                        ipns: ipnsValidator
                    },
                    selectors: {
                        ipns: ipnsSelector
                    }
                }),
                pubsub: gossipsub(),
                transports: [webSockets()],
                connectionEncryption: [
                    noise()
                ],
            })
             */

            // @ts-ignore
            //const helia = await createHelia({libp2p})

            const helia = await createHelia();

            IPFSManager.instance = new IPFSManager(
                helia,
                strings(helia),
                unixfs(helia),
                ipns(helia)
                //ipns(helia, [ dht(helia),
                //pubsub(helia)
                //])
            );
        }

        return IPFSManager.instance;
    }

    //TODO: switch to a buffer content instead of string
    public async write(data: string): Promise<string> {
        return (await this.strings.add(data)).toString(base64.encoder);
    }

    public async read(cid: string): Promise<string> {
        return await this.strings.get(CID.parse(cid, base64.decoder));
    }

    public async writeNamed(data: string, privateKey: string): Promise<string> {
        const cid = await this.write(data);

        const publicKey = new KeyPair(privateKey).publicKey;
        const publicKeyHash = (await HashUtils.pbkdf2(publicKey, 'ipdw', 1, 32, 'sha256')).toString('hex');
        if (!(await this.core.libp2p.keychain.listKeys()).find(e => e.name === publicKeyHash))
            await this.core.libp2p.keychain.importKey(publicKeyHash, privateKey, '');

        const peerId = await this.core.libp2p.keychain.exportPeerId(publicKeyHash);
        await this.names.publish(peerId, CID.parse(cid, base64.decoder))

        return peerId.toString();
    }

    public async readNamed(privateKey: string): Promise<string> {
        const publicKey = new KeyPair(privateKey).publicKey;
        const publicKeyHash = (await HashUtils.pbkdf2(publicKey, 'ipdw', 1, 32, 'sha256')).toString('hex');
        if (!(await this.core.libp2p.keychain.listKeys()).find(e => e.name === publicKeyHash))
            await this.core.libp2p.keychain.importKey(publicKeyHash, privateKey, '');

        const peerId = await this.core.libp2p.keychain.exportPeerId(publicKeyHash);
        const cid = await this.names.resolve(peerId);

        return this.read(cid.toString(base64.encoder));
    }

    //TODO: needs to be migrated to helia
    public async readStream(cid: string, offset: number = 0): Promise<ReadableStream<Uint8Array>> {
        const _self = this;
        return new ReadableStream<Uint8Array>({
            async start(controller) {
                //const iterable = await _self.node.blockstore.getMany([CID.parse(cid, base64.decoder)], {offset});

                //for await (const chunk of iterable)
                //controller.enqueue(chunk);

                controller.close();
            },
        });
    }

    //TODO: needs to be migrated to helia
    public async getStats(cid: string): Promise<{ size: number, type: 'directory' | 'file' }> {
        //const stat = await this.ipfs.files.stat("/ipfs/" + cid);
        //return {size: stat.size, type: stat.type};
        return {size: 0, type: 'file'};
    }

    public async addPubSubListener(topic: string, listener: (msg: string) => void) {
        //await (this.core.libp2p as unknown as Libp2p).pubsub.addEventListener('message', (msg) => listener(msg.data.toString()))
        //await (this.core.libp2p as unknown as Libp2p).pubsub.subscribe(topic)
    }

    public async removeAllPubSubListeners(): Promise<void> {
        //const topics = await this.core.libp2p.pubsub.ls();
        //await Promise.all(topics.map(t => this.core.libp2p.pubsub.unsubscribe(t)));
    }

    public async sendPubSubMessage(topic: string, message: string) {
        //await this.core.libp2p.pubsub.publish(nonce, Buffer.from(message, 'utf8'))
    }

}

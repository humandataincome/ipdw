import * as Y from 'yjs'
import type {Libp2p} from "@libp2p/interface";
import type {IncomingStreamData} from '@libp2p/interface/src/stream-handler';
import {GossipSub} from "@chainsafe/libp2p-gossipsub";
import {PeerId} from "@libp2p/interface/src/peer-id";
import {BlockStorage} from "../blocks";
import createLibp2p from "./libp2p.factory";
import {SubscriptionChangeData} from "@libp2p/interface/src/pubsub";

export class P2PSyncProvider {
    private readonly yDoc: Y.Doc;
    private node: Libp2p<{ pubsub: GossipSub }>;

    private readonly topic: string;
    private readonly protocol: string;

    private readonly peers: PeerId[];

    constructor(yDoc: Y.Doc, node: Libp2p<{ pubsub: GossipSub }>, roomId: string) {
        this.yDoc = yDoc;
        this.node = node;
        this.topic = `/ipdw/discover/${roomId}/1.0.0`;
        this.protocol = `/ipdw/sync/${roomId}/1.0.0`;
        this.peers = [];
    }

    public static async create(blockStorage: BlockStorage, topic: string, autorun: boolean = true): Promise<P2PSyncProvider> {
        const libp2p = await createLibp2p();
        const yDoc = new Y.Doc()

        yDoc.getArray('blocks').insert(0, await blockStorage.toArray());
        let lock = false;
        blockStorage.events.addEventListener('insert', e => {
            if (!lock) yDoc.getArray('blocks').insert(e.detail!.index, [e.detail!.value])
        });
        blockStorage.events.addEventListener('delete', e => {
            if (!lock) yDoc.getArray('blocks').delete(e.detail!.index)
        });
        yDoc.getArray('blocks').observe(async (e) => {
            lock = true;
            //TODO: Here I need to determine real index
            for (const v of e.changes.deleted)
                await blockStorage.delete(0);
            for (const v of e.changes.added)
                await blockStorage.set(0, v.content.getContent()[0] as Uint8Array)
            lock = false;
        });

        const res = new P2PSyncProvider(yDoc, libp2p, topic);
        if (autorun) await res.run();
        return res;
    }

    public async run(): Promise<void> {
        this.yDoc.on('update', this.onDocumentUpdate.bind(this));
        await this.node.handle(this.protocol, this.onProtocolConnection.bind(this))
        this.node.services.pubsub.addEventListener('subscription-change', this.onTopicSubscriptionChange.bind(this));
        this.node.services.pubsub.subscribe(this.topic);
    }

    public async destroy(): Promise<void> {
        this.node.services.pubsub.unsubscribe(this.topic);
        await this.node.unhandle(this.protocol);
    }

    private async onTopicSubscriptionChange(event: CustomEvent<SubscriptionChangeData>) {
        const subscribed = event.detail.subscriptions.filter(s => s.topic === this.topic && s.subscribe).length === 1;
        const peerIndex = this.peers.indexOf(event.detail.peerId);
        if (peerIndex === -1 && subscribed) {
            console.log("ipdw:peer:add", event.detail);
            //TODO: verify before pushing and syncing
            this.peers.push(event.detail.peerId);
            await this.runProtocol(event.detail.peerId);
        } else {
            this.peers.splice(peerIndex, 1);
        }
    }

    private async onDocumentUpdate(): Promise<void> {
        for (const peerId of this.peers)
            await this.runProtocol(peerId);
    }

    private async runProtocol(peerId: PeerId): Promise<void> {
        const stream = await this.node.dialProtocol(peerId, this.protocol);

        const _this = this;
        await stream.sink((async function* () {
            yield Y.encodeStateVector(_this.yDoc);
            const stateRes = await stream.source.next();
            if (!stateRes.done) {
                const remoteStateVector = stateRes.value.subarray(0, stateRes.value.length);
                yield Y.encodeStateAsUpdate(_this.yDoc, remoteStateVector);
            }
        })())
    }

    private async onProtocolConnection(data: IncomingStreamData): Promise<void> {
        const stream = data.stream;
        const stateRes = await stream.source.next();
        if (!stateRes.done) {
            const remoteStateVector = stateRes.value.subarray(0, stateRes.value.length);
            if (!this.Uint8ArrayEquals(remoteStateVector, Y.encodeStateVector(this.yDoc))) {
                await stream.sink([Y.encodeStateVector(this.yDoc)]);
                const updateRes = await stream.source.next();
                if (!updateRes.done) {
                    const remoteUpdateVector = updateRes.value.subarray(0, updateRes.value.length);
                    Y.applyUpdate(this.yDoc, remoteUpdateVector);
                    await stream.close()
                }
            }
        }
    }

    private Uint8ArrayEquals(a: Uint8Array, b: Uint8Array): boolean {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++)
            if (a[i] !== b[i]) return false;
        return true;
    }

}

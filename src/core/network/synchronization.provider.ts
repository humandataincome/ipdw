import * as Y from 'yjs'
import type {Libp2p, PubSub} from "@libp2p/interface";
import type {IncomingStreamData} from '@libp2p/interface/src/stream-handler';
import {PeerId} from "@libp2p/interface/src/peer-id";
import {BlockStorage} from "../blocks";
import createLibp2p from "./libp2p.factory";
import {SubscriptionChangeData} from "@libp2p/interface/src/pubsub";
import {KadDHT} from "@libp2p/kad-dht";
import {CryptoUtils, TypedCustomEvent, TypedEventTarget} from "../../utils";

export class SynchronizationProvider {
    public events: TypedEventTarget<{
        "peer:add": TypedCustomEvent<{ peerId: PeerId }>;
        "peer:remove": TypedCustomEvent<{ peerId: PeerId }>;
        "peer:syncing": TypedCustomEvent<{ peerId: PeerId }>;
        "peer:synced": TypedCustomEvent<{ peerId: PeerId }>;
    }> = new TypedEventTarget();

    private node: Libp2p<{ pubsub: PubSub, dht: KadDHT }>;

    private readonly discoverTopic: string;
    private readonly protocolName: string;

    private readonly peers: PeerId[];

    private blockStorage: BlockStorage;
    private readonly crdtDoc: Y.Doc;
    private crdtPropagate: boolean = true; //TODO: LOOK HERE

    constructor(blockStorage: BlockStorage, node: Libp2p<{ pubsub: PubSub, dht: KadDHT }>, roomId: string) {
        this.node = node;
        this.discoverTopic = `/ipdw/discover/1.0.0/${roomId}`;
        this.protocolName = `/ipdw/sync/1.0.0/${roomId}`;
        this.peers = [];
        this.blockStorage = blockStorage;
        this.crdtDoc = new Y.Doc();
    }

    public static async create(blockStorage: BlockStorage, topic: string, autorun: boolean = true): Promise<SynchronizationProvider> {
        const libp2p = await createLibp2p();

        const res = new SynchronizationProvider(blockStorage, libp2p, topic);
        if (autorun) await res.run();
        return res;
    }

    public async run(): Promise<void> {
        //TODO: HERE FIX
        this.crdtDoc.getArray('blocks').insert(0, await this.blockStorage.toArray());

        this.blockStorage.events.addEventListener('insert', e => {
            this.crdtDoc.getArray('blocks').insert(e.detail!.index, [e.detail!.value])
        });
        this.blockStorage.events.addEventListener('delete', e => {
            this.crdtDoc.getArray('blocks').delete(e.detail!.index)
        });

        this.crdtDoc.getArray('blocks').observe(async (e) => {
            console.log(JSON.stringify(e));
            //TODO: Here I need to determine real index
            for (const v of e.changes.deleted)
                await this.blockStorage.delete(0);
            for (const v of e.changes.added)
                await this.blockStorage.set(0, v.content.getContent()[0] as Uint8Array)
        });

        this.crdtDoc.on('update', async () => {
            if (this.crdtPropagate)
                for (const peerId of this.peers)
                    await this.runProtocol(peerId);
        });
        await this.node.handle(this.protocolName, this.onProtocolConnection.bind(this))

        this.node.services.pubsub.addEventListener('subscription-change', this.onTopicSubscriptionChange.bind(this));
        this.node.services.pubsub.subscribe(this.discoverTopic);
    }

    public async destroy(): Promise<void> {
        this.node.services.pubsub.unsubscribe(this.discoverTopic);
        await this.node.unhandle(this.protocolName);
    }

    private async onTopicSubscriptionChange(event: CustomEvent<SubscriptionChangeData>) {
        console.log("subscription:change", event.detail);
        const subscribed = event.detail.subscriptions.filter(s => s.topic === this.discoverTopic && s.subscribe).length === 1;
        const peerIndex = this.peers.indexOf(event.detail.peerId);
        if (peerIndex === -1 && subscribed) {
            if (await this.verifyAccess(event.detail.peerId)) {
                console.log("ipdw:peer:add", event.detail);

                this.events.dispatchTypedEvent('peer:add', new TypedCustomEvent('peer:add', {detail: {peerId: event.detail.peerId}}));
                this.peers.push(event.detail.peerId);
                await this.runProtocol(event.detail.peerId);
            }
        } else {
            console.log("ipdw:peer:remove", event.detail);

            this.events.dispatchTypedEvent('peer:remove', new TypedCustomEvent('peer:add', {detail: {peerId: event.detail.peerId}}));
            this.peers.splice(peerIndex, 1);
        }
    }

    private async verifyAccess(peerId: PeerId) {
        //TODO: verify if it has the ownership key by sending a random challenge
        return true;
    }

    private async runProtocol(peerId: PeerId): Promise<void> {
        this.events.dispatchTypedEvent('peer:syncing', new TypedCustomEvent('peer:syncing', {detail: {peerId}}));

        try {
            const stream = await this.node.dialProtocol(peerId, this.protocolName);

            const _this = this;
            await stream.sink((async function* () {
                yield Y.encodeStateVector(_this.crdtDoc);
                const stateRes = await stream.source.next();

                if (!stateRes.done) {
                    const remoteStateVector = stateRes.value.subarray(0, stateRes.value.length);
                    yield Y.encodeStateAsUpdate(_this.crdtDoc, remoteStateVector);
                }
            })())
        } catch (e) {
            console.log('Failed to dial protocol on peer', peerId);
        }

        this.events.dispatchTypedEvent('peer:synced', new TypedCustomEvent('peer:synced', {detail: {peerId}}));
    }

    private async onProtocolConnection(data: IncomingStreamData): Promise<void> {
        this.events.dispatchTypedEvent('peer:syncing', new TypedCustomEvent('peer:syncing', {detail: {peerId: data.connection.remotePeer}}));

        const stream = data.stream;
        const stateRes = await stream.source.next();

        if (!stateRes.done) {
            const remoteStateVector = stateRes.value.subarray(0, stateRes.value.length);

            if (!CryptoUtils.Uint8ArrayEquals(remoteStateVector, Y.encodeStateVector(this.crdtDoc))) {
                await stream.sink([Y.encodeStateVector(this.crdtDoc)]);
                const updateRes = await stream.source.next();

                if (!updateRes.done) {
                    const remoteUpdateVector = updateRes.value.subarray(0, updateRes.value.length);
                    Y.applyUpdate(this.crdtDoc, remoteUpdateVector);
                    await stream.close();
                }
            }
        }

        this.events.dispatchTypedEvent('peer:synced', new TypedCustomEvent('peer:synced', {detail: {peerId: data.connection.remotePeer}}));
    }

}

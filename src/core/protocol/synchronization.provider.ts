import * as Y from 'yjs'
import type {Libp2p, PubSub} from "@libp2p/interface";
import type {IncomingStreamData} from '@libp2p/interface/src/stream-handler';
import {PeerId} from "@libp2p/interface/src/peer-id";
import {BlockStorage} from "../blocks";
import {SubscriptionChangeData} from "@libp2p/interface/src/pubsub";
import {KadDHT} from "@libp2p/kad-dht";
import {ArrayUtils, TypedCustomEvent, TypedEventTarget} from "../../utils";
import {SwarmsubService} from "./swarmsub.service";
import {Fetch} from "@libp2p/fetch";

export class SynchronizationProvider {
    public events: TypedEventTarget<{
        "peer:add": TypedCustomEvent<{ peerId: PeerId }>;
        "peer:remove": TypedCustomEvent<{ peerId: PeerId }>;
        "peer:syncing": TypedCustomEvent<{ peerId: PeerId, type: 'IN' | 'OUT' }>;
        "peer:synced": TypedCustomEvent<{ peerId: PeerId, type: 'IN' | 'OUT' }>;
    }> = new TypedEventTarget();

    public node: Libp2p<{ pubsub: PubSub, dht: KadDHT, fetch: Fetch }>;
    public swarm: SwarmsubService;
    public readonly peers: PeerId[];
    public blockStorage: BlockStorage;
    private readonly discoverTopic: string;
    private readonly protocolName: string;
    private readonly crdtDoc: Y.Doc;

    constructor(blockStorage: BlockStorage, node: Libp2p<{ pubsub: PubSub, dht: KadDHT, fetch: Fetch }>, roomId: string) {
        this.node = node;
        this.swarm = new SwarmsubService(node);
        this.discoverTopic = `/ipdw/discover/1.0.0/${roomId}`;
        this.protocolName = `/ipdw/sync/1.0.0/${roomId}`;
        this.peers = [];
        this.blockStorage = blockStorage;
        this.crdtDoc = new Y.Doc();
    }

    public async start(): Promise<void> {
        this.crdtDoc.getArray('blocks').insert(0, await this.blockStorage.toArray());

        let crdtLock = false;
        let storageLock = false;

        this.blockStorage.events.addEventListener('insert', async e => {
            if (!crdtLock) {
                storageLock = true;
                //console.log('block:insert', this.node.peerId, e.detail);
                this.crdtDoc.getArray('blocks').insert(e.detail!.index, [e.detail!.value]);
                storageLock = false;
            }
        });
        this.blockStorage.events.addEventListener('delete', async e => {
            if (!crdtLock) {
                storageLock = true;
                //console.log('block:delete', this.node.peerId, e.detail);
                this.crdtDoc.getArray('blocks').delete(e.detail!.index);
                storageLock = false;
            }
        });

        this.crdtDoc.getArray('blocks').observe(async (e) => {
            if (!storageLock) {
                crdtLock = true;

                for (const v of e.changes.delta.reverse()) {
                    let index = v.retain || 0;
                    if (v.delete) {
                        //console.log('crdt:delete', this.node.peerId, index, v.delete);
                        for (let i = 0; i < v.delete; i++) {
                            await this.blockStorage.delete(index);
                        }
                    } else if (v.insert) {
                        //console.log('crdt:insert', this.node.peerId, index, v.insert);
                        for (const inserted of v.insert) {
                            await this.blockStorage.insert(index++, inserted);
                        }
                    }
                }

                crdtLock = false;
            }

        });

        this.crdtDoc.on('update', async () => {
            for (const peerId of this.peers)
                await this.runProtocol(peerId);
        });

        // Handle the crdt sync protocol
        await this.node.handle(this.protocolName, this.onProtocolConnection.bind(this), {runOnTransientConnection: false})

        // For connected peers find those really interested in topic and evaluate
        this.node.services.pubsub.getSubscribers(this.discoverTopic).forEach(this.onTopicSubscribedPeer.bind(this));
        this.node.services.pubsub.addEventListener('subscription-change', this.onTopicSubscriptionChange.bind(this));
        this.node.services.pubsub.subscribe(this.discoverTopic);
        //this.node.services.pubsub.addEventListener('message', console.log);
        //setInterval(() => this.node.services.pubsub.publish(this.discoverTopic, new TextEncoder().encode('syn')).then(), 1000)

        // Use swarm to find peer candidates and try connection to them
        (await this.swarm.getSubscribers(this.discoverTopic)).forEach((p: PeerId) => this.node.dial(p).then());
        await this.swarm.setSubscriptionListener(this.discoverTopic, (p: PeerId) => this.node.dial(p).then());
        //await this.swarm.setSubscriptionListener(this.discoverTopic, (p: PeerId) => this.onTopicSubscribedPeer(p).then());
        await this.swarm.subscribe(this.discoverTopic);

        // Why bootstrap node does not propagate subscription?
    }

    public async stop(): Promise<void> {
        //this.blockStorage.events.removeEventListener('insert', null) //TODO: here remove real references
        //this.blockStorage.events.removeEventListener('delete', null) //TODO: here remove real references
        //this.crdtDoc.getArray('blocks').unobserve(null) //TODO: here remove real references

        await this.node.unhandle(this.protocolName);

        this.node.services.pubsub.removeEventListener('subscription-change', this.onTopicSubscriptionChange.bind(this))
        this.node.services.pubsub.unsubscribe(this.discoverTopic);

        await this.swarm.removeSubscriptionListener(this.discoverTopic);
        await this.swarm.unsubscribe(this.discoverTopic);

        this.crdtDoc.getArray('blocks').delete(0, this.crdtDoc.getArray('blocks').length);
    }

    private async onTopicSubscriptionChange(event: CustomEvent<SubscriptionChangeData>) {
        console.log("subscription:change", this.node.peerId, event.detail);
        const subscribed = event.detail.subscriptions.filter(s => s.topic === this.discoverTopic && s.subscribe).length === 1;
        const peerIndex = this.peers.indexOf(event.detail.peerId);
        if (peerIndex === -1 && subscribed) {
            await this.onTopicSubscribedPeer(event.detail.peerId);
        } else if (peerIndex !== -1 && !subscribed) {
            console.log("ipdw:peer:remove", this.node.peerId, event.detail);

            this.peers.splice(peerIndex, 1);
            this.events.dispatchTypedEvent('peer:remove', new TypedCustomEvent('peer:remove', {detail: {peerId: event.detail.peerId}}));
        }
    }

    private async onTopicSubscribedPeer(peerId: PeerId) {
        if (await this.verifyAccess(peerId)) {
            console.log("ipdw:peer:add", this.node.peerId);

            this.peers.push(peerId);
            this.events.dispatchTypedEvent('peer:add', new TypedCustomEvent('peer:add', {detail: {peerId: peerId}}));
            await this.runProtocol(peerId);
        }
    }

    private async verifyAccess(peerId: PeerId) {
        //TODO: verify if it has the ownership key by sending a random challenge
        return true;
    }

    private async runProtocol(peerId: PeerId): Promise<void> {
        try {
            this.events.dispatchTypedEvent('peer:syncing', new TypedCustomEvent('peer:syncing', {detail: {peerId, type: 'OUT' as 'OUT'}}));

            const stream = await this.node.dialProtocol(peerId, this.protocolName, {runOnTransientConnection: false});

            const _this = this;
            await stream.sink((async function* () {
                yield Y.encodeStateVector(_this.crdtDoc);
                const stateRes = await stream.source.next();

                if (!stateRes.done) {
                    const remoteStateVector = stateRes.value.subarray(0, stateRes.value.length);
                    yield Y.encodeStateAsUpdate(_this.crdtDoc, remoteStateVector);
                }
            })());

            await stream.close();

            this.events.dispatchTypedEvent('peer:synced', new TypedCustomEvent('peer:synced', {detail: {peerId, type: 'OUT' as 'OUT'}}));
        } catch (e: any) {
            console.log('Dial failed on peer', peerId, e);
            console.log("ipdw:peer:remove", this.node.peerId, peerId);

            this.peers.splice(this.peers.indexOf(peerId), 1);
            this.events.dispatchTypedEvent('peer:remove', new TypedCustomEvent('peer:remove', {detail: {peerId: peerId}}));
        }
    }

    private async onProtocolConnection(data: IncomingStreamData): Promise<void> {
        try {
            this.events.dispatchTypedEvent('peer:syncing', new TypedCustomEvent('peer:syncing', {detail: {peerId: data.connection.remotePeer, type: 'IN' as 'IN'}}));

            const stream = data.stream;
            const stateRes = await stream.source.next();

            if (!stateRes.done) {
                const remoteStateVector = stateRes.value.subarray(0, stateRes.value.length);

                if (!ArrayUtils.Uint8ArrayEquals(remoteStateVector, Y.encodeStateVector(this.crdtDoc))) {
                    await stream.sink([Y.encodeStateVector(this.crdtDoc)]);
                    const updateRes = await stream.source.next();

                    if (!updateRes.done) {
                        const remoteUpdateVector = updateRes.value.subarray(0, updateRes.value.length);
                        Y.applyUpdate(this.crdtDoc, remoteUpdateVector);
                        await stream.close();
                    }
                }
            }

            this.events.dispatchTypedEvent('peer:synced', new TypedCustomEvent('peer:synced', {detail: {peerId: data.connection.remotePeer, type: 'IN' as 'IN'}}));
        } catch (e) {
            console.log('Connection failed on peer', data.connection.remotePeer, e);
            console.log("ipdw:peer:remove", this.node.peerId, data.connection.remotePeer);

            this.peers.splice(this.peers.indexOf(data.connection.remotePeer), 1);
            this.events.dispatchTypedEvent('peer:remove', new TypedCustomEvent('peer:remove', {detail: {peerId: data.connection.remotePeer}}));
        }
    }

}

import * as Y from 'yjs'
import type {Libp2p, PubSub} from "@libp2p/interface";
import type {IncomingStreamData} from '@libp2p/interface/src/stream-handler';
import {PeerId} from "@libp2p/interface/src/peer-id";
import {SubscriptionChangeData} from "@libp2p/interface/src/pubsub";
import {KadDHT} from "@libp2p/kad-dht";
import {ArrayUtils, CryptoUtils, TypedCustomEvent, TypedEventTarget} from "../../utils";
import {Fetch} from "@libp2p/fetch";

import util from "util";
import crypto from "crypto";
import {FetchsubService} from "./fetchsub.service";

export const IPDW_DEFAULT_ADDRESS_DERIVATION_SALT = Buffer.from('DJDFhR9z', 'utf8');

export class SynchronizationProvider {
    public events: TypedEventTarget<{
        "peer:added": TypedCustomEvent<{ peerId: PeerId }>;
        "peer:removed": TypedCustomEvent<{ peerId: PeerId }>;
        "peer:syncing": TypedCustomEvent<{ peerId: PeerId, type: 'IN' | 'OUT' }>;
        "peer:synced": TypedCustomEvent<{ peerId: PeerId, type: 'IN' | 'OUT' }>;
    }> = new TypedEventTarget();
    public peers: PeerId[];
    public node: Libp2p<{ pubsub: PubSub, dht: KadDHT, fetch: Fetch }>;

    private readonly crdtDoc: Y.Doc;
    private readonly privateKey: Buffer;
    private readonly publicKey: Buffer;
    private readonly address: string;
    private fetchsub: FetchsubService;
    private readonly discoverTopicNamePrefix = '/ipdw/discover/1.0.0/';
    private readonly authFetchPathPrefix = '/ipdw/auth/1.0.0/';
    private readonly syncProtocolNamePrefix = '/ipdw/sync/1.0.0/';

    constructor(node: Libp2p<{ pubsub: PubSub, dht: KadDHT, fetch: Fetch }>, crdtDoc: Y.Doc, privateKey: Buffer, publicKey: Buffer, address: string) {
        this.node = node;
        this.crdtDoc = crdtDoc;
        this.privateKey = privateKey;
        this.publicKey = publicKey;
        this.address = address;
        this.fetchsub = new FetchsubService(node);
        this.peers = [];
    }

    public static async Init(node: Libp2p<{ pubsub: PubSub, dht: KadDHT, fetch: Fetch }>, crdtDoc: Y.Doc, privateKey: string): Promise<SynchronizationProvider> {
        const [privateKeyBuff, publicKeyBuff] = await CryptoUtils.GetKeyPair(Buffer.from(privateKey.slice(2), 'hex'));
        const derivedKeyBuffer = await util.promisify(crypto.pbkdf2)(privateKey, IPDW_DEFAULT_ADDRESS_DERIVATION_SALT, 100100, 32, 'sha256');
        const address = derivedKeyBuffer.toString('hex').slice(0, 32);

        return new SynchronizationProvider(node, crdtDoc, privateKeyBuff, publicKeyBuff, address);
    }

    public async start(): Promise<void> {
        this.crdtDoc.on('update', this.onDocumentUpdate.bind(this));

        // Handle the crdt sync protocol
        await this.node.handle(this.discoverTopicNamePrefix + this.address, this.onSyncProtocol.bind(this), {runOnTransientConnection: true})

        // For connected peers find those really interested in topic and evaluate
        this.node.services.pubsub.getSubscribers(this.discoverTopicNamePrefix + this.address).forEach(this.onTopicSubscribedPeer.bind(this));
        this.node.services.pubsub.addEventListener('subscription-change', this.onTopicSubscriptionChange.bind(this));
        this.node.services.pubsub.subscribe(this.discoverTopicNamePrefix + this.address);

        // Use services to find peer candidates and try connection to them
        (await this.fetchsub.getSubscribers(this.discoverTopicNamePrefix + this.address)).forEach((p: PeerId) => this.node.dial(p).then());
        await this.fetchsub.addSubscriptionListener(this.discoverTopicNamePrefix + this.address, (t: 'found', p: PeerId) => this.onTopicSubscribedPeer(p).then());
        this.fetchsub.subscribe(this.discoverTopicNamePrefix + this.address);
    }

    public async stop(): Promise<void> {
        this.crdtDoc.off('update', this.onDocumentUpdate.bind(this))

        await this.node.unhandle(this.syncProtocolNamePrefix + this.address);

        this.node.services.pubsub.removeEventListener('subscription-change', this.onTopicSubscriptionChange.bind(this))
        this.node.services.pubsub.unsubscribe(this.discoverTopicNamePrefix + this.address);

        await this.fetchsub.removeSubscriptionListener(this.discoverTopicNamePrefix + this.address, (t: 'found', p: PeerId) => this.onTopicSubscribedPeer(p).then());
        this.fetchsub.unsubscribe(this.discoverTopicNamePrefix + this.address);
    }

    private async onDocumentUpdate(arg0: Uint8Array, arg1: any, arg2: Y.Doc, arg3: Y.Transaction) {
        for (const peerId of this.peers)
            await this.runSyncProtocol(peerId);
    }

    private async onTopicSubscriptionChange(event: CustomEvent<SubscriptionChangeData>) {
        console.log("subscription:changed", this.node.peerId, event.detail);

        if (event.detail.peerId.equals(this.node.peerId))
            return;

        const subscribed = event.detail.subscriptions.filter(s => s.topic === this.discoverTopicNamePrefix + this.address && s.subscribe).length === 1;
        const peerIndex = this.peers.indexOf(event.detail.peerId);
        if (peerIndex === -1 && subscribed) {
            await this.onTopicSubscribedPeer(event.detail.peerId);
        } else if (peerIndex !== -1 && !subscribed) {
            console.log("ipdw:peer:removing", this.node.peerId, event.detail.peerId);

            this.peers.splice(peerIndex, 1);
            await this.node.hangUp(this.node.peerId);
            this.events.dispatchTypedEvent('peer:removed', new TypedCustomEvent('peer:removed', {detail: {peerId: event.detail.peerId}}));
        }
    }

    private async onTopicSubscribedPeer(peerId: PeerId) {
        if (this.peers.indexOf(peerId) === -1 && await this.runAuthFetch(peerId)) {
            console.log("ipdw:peer:adding", this.node.peerId, peerId);

            this.peers.push(peerId);
            this.events.dispatchTypedEvent('peer:added', new TypedCustomEvent('peer:added', {detail: {peerId: peerId}}));
            await this.runSyncProtocol(peerId);
        }
    }

    private async runAuthFetch(peerId: PeerId): Promise<boolean> {
        const challenge = Date.now().toString();
        const signature = await this.node.services.fetch.fetch(peerId, this.authFetchPathPrefix + challenge);
        if (!signature)
            return false;

        const payload = [new Uint8Array(Buffer.from(challenge)), peerId.publicKey!];
        return CryptoUtils.Verify(this.publicKey, Buffer.from(signature), Buffer.from(ArrayUtils.Uint8ArrayMarshal(payload)));
    }

    private async onAuthFetch(path: string): Promise<Uint8Array> {
        const challenge = path.slice(this.authFetchPathPrefix.length);
        const payload = [new Uint8Array(Buffer.from(challenge)), this.node.peerId.publicKey!];
        return await CryptoUtils.Sign(this.privateKey, Buffer.from(ArrayUtils.Uint8ArrayMarshal(payload)));
    }

    private async runSyncProtocol(peerId: PeerId): Promise<void> {
        try {
            this.events.dispatchTypedEvent('peer:syncing', new TypedCustomEvent('peer:syncing', {detail: {peerId, type: 'OUT' as 'OUT'}}));

            const stream = await this.node.dialProtocol(peerId, this.syncProtocolNamePrefix + this.address, {runOnTransientConnection: true});

            const _this = this;
            await stream.sink((async function* () {
                yield Y.encodeStateVector(_this.crdtDoc);
                const stateRes = await stream.source.next();

                if (!stateRes.done) {
                    const remoteStateVector = stateRes.value.subarray(0, stateRes.value.length);
                    yield Y.encodeStateAsUpdate(_this.crdtDoc, remoteStateVector);
                }
                //await stream.close();
            })());

            this.events.dispatchTypedEvent('peer:synced', new TypedCustomEvent('peer:synced', {detail: {peerId, type: 'OUT' as 'OUT'}}));
        } catch (e: any) {
            console.log('Dial failed on peer', peerId, e);
            console.log("ipdw:peer:removing", this.node.peerId, peerId);

            this.peers.splice(this.peers.indexOf(peerId), 1);
            await this.node.hangUp(this.node.peerId);
            this.events.dispatchTypedEvent('peer:removed', new TypedCustomEvent('peer:removed', {detail: {peerId: peerId}}));
        }
    }

    private async onSyncProtocol(data: IncomingStreamData): Promise<void> {
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
                    }
                    await stream.close();
                }
            }

            this.events.dispatchTypedEvent('peer:synced', new TypedCustomEvent('peer:synced', {detail: {peerId: data.connection.remotePeer, type: 'IN' as 'IN'}}));
        } catch (e) {
            console.log('Connection failed on peer', data.connection.remotePeer, e);
            console.log("ipdw:peer:removing", this.node.peerId, data.connection.remotePeer);

            this.peers.splice(this.peers.indexOf(data.connection.remotePeer), 1);
            await this.node.hangUp(this.node.peerId);
            this.events.dispatchTypedEvent('peer:removed', new TypedCustomEvent('peer:removed', {detail: {peerId: data.connection.remotePeer}}));
        }
    }

}

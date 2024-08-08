import * as Y from 'yjs'
import type {Libp2p, PubSub} from "@libp2p/interface";
import type {IncomingStreamData} from '@libp2p/interface/src/stream-handler';
import {PeerId} from "@libp2p/interface/src/peer-id";
import {SubscriptionChangeData} from "@libp2p/interface/src/pubsub";
import {KadDHT} from "@libp2p/kad-dht";
import {ArrayUtils, CryptoUtils, TypedCustomEvent, TypedEventTarget} from "../../utils";
import {Fetch} from "@libp2p/fetch";
import {FetchsubService} from "./fetchsub.service";

import util from "util";
import crypto from "crypto";

import Debug from "debug";

const debug = Debug('ipdw:synchronization')

export const IPDW_DEFAULT_ADDRESS_DERIVATION_SALT = Buffer.from('DJDFhR9z', 'utf8');

type SyncEventTypes = {
    "peer:added": TypedCustomEvent<{ peerId: PeerId }>;
    "peer:removed": TypedCustomEvent<{ peerId: PeerId }>;
    "peer:syncing": TypedCustomEvent<{ peerId: PeerId, type: 'IN' | 'OUT' }>;
    "peer:synced": TypedCustomEvent<{ peerId: PeerId, type: 'IN' | 'OUT' }>;
};

export class SynchronizationProvider {
    private static readonly PROTOCOL_VERSION = '1.0.0';
    public events: TypedEventTarget<SyncEventTypes> = new TypedEventTarget();
    public peers: Set<PeerId> = new Set();
    public readonly node: Libp2p<{ pubsub: PubSub, dht: KadDHT, fetch: Fetch }>;
    private readonly crdtDoc: Y.Doc;
    private readonly privateKey: Buffer;
    private readonly publicKey: Buffer;
    private readonly address: string;
    private fetchsub: FetchsubService;
    private readonly discoverTopicName: string;
    private readonly authFetchPath: string;
    private readonly syncProtocolName: string;

    private constructor(node: Libp2p<{ pubsub: PubSub, dht: KadDHT, fetch: Fetch }>, crdtDoc: Y.Doc, privateKey: Buffer, publicKey: Buffer, address: string) {
        this.node = node;
        this.crdtDoc = crdtDoc;
        this.privateKey = privateKey;
        this.publicKey = publicKey;
        this.address = address;
        this.fetchsub = new FetchsubService(node);
        this.discoverTopicName = `/ipdw/discover/${SynchronizationProvider.PROTOCOL_VERSION}/${this.address}`;
        this.authFetchPath = `/ipdw/auth/${SynchronizationProvider.PROTOCOL_VERSION}/`;
        this.syncProtocolName = `/ipdw/sync/${SynchronizationProvider.PROTOCOL_VERSION}/${this.address}`;
    }

    public static async Init(node: Libp2p<{ pubsub: PubSub, dht: KadDHT, fetch: Fetch }>, crdtDoc: Y.Doc, privateKey: string): Promise<SynchronizationProvider> {
        const [privateKeyBuff, publicKeyBuff] = await CryptoUtils.GetKeyPair(Buffer.from(privateKey.slice(2), 'hex'));
        const derivedKeyBuffer = await util.promisify(crypto.pbkdf2)(privateKey, IPDW_DEFAULT_ADDRESS_DERIVATION_SALT, 100100, 32, 'sha256');
        const address = derivedKeyBuffer.toString('hex').slice(0, 32);

        return new SynchronizationProvider(node, crdtDoc, privateKeyBuff, publicKeyBuff, address);
    }

    public async start(): Promise<void> {
        this.crdtDoc.on('update', this.onDocumentUpdate.bind(this));
        await this.node.handle(this.syncProtocolName, this.onSyncProtocol.bind(this), {runOnTransientConnection: true});
        this.setupPubSubListeners();
        await this.setupFetchSub();
    }

    public async stop(): Promise<void> {
        this.crdtDoc.off('update', this.onDocumentUpdate.bind(this));
        await this.node.unhandle(this.syncProtocolName);
        this.teardownPubSubListeners();
        await this.teardownFetchSub();
    }

    private setupPubSubListeners(): void {
        this.node.services.pubsub.getSubscribers(this.discoverTopicName).forEach(this.onTopicSubscribedPeer.bind(this));
        this.node.services.pubsub.addEventListener('subscription-change', this.onTopicSubscriptionChange.bind(this));
        this.node.services.pubsub.subscribe(this.discoverTopicName);
    }

    private teardownPubSubListeners(): void {
        this.node.services.pubsub.removeEventListener('subscription-change', this.onTopicSubscriptionChange.bind(this));
        this.node.services.pubsub.unsubscribe(this.discoverTopicName);
    }

    private async setupFetchSub(): Promise<void> {
        const subscribers = await this.fetchsub.getSubscribers(this.discoverTopicName);
        subscribers.forEach((p: PeerId) => this.node.dial(p).catch(console.error));
        await this.fetchsub.addSubscriptionListener(this.discoverTopicName, (t: 'found', p: PeerId) => this.onTopicSubscribedPeer(p));
        this.fetchsub.subscribe(this.discoverTopicName);
    }

    private async teardownFetchSub(): Promise<void> {
        await this.fetchsub.removeSubscriptionListener(this.discoverTopicName, (t: 'found', p: PeerId) => this.onTopicSubscribedPeer(p));
        this.fetchsub.unsubscribe(this.discoverTopicName);
    }

    private async onDocumentUpdate(update: Uint8Array, origin: any, doc: Y.Doc): Promise<void> {
        for (const peerId of this.peers) {
            await this.runSyncProtocol(peerId).catch(console.error);
        }
    }

    private async onTopicSubscriptionChange(event: CustomEvent<SubscriptionChangeData>): Promise<void> {
        debug("subscription:changed", this.node.peerId.toString(), event.detail);

        if (event.detail.peerId.equals(this.node.peerId)) return;

        const subscribed = event.detail.subscriptions.some(s => s.topic === this.discoverTopicName && s.subscribe);

        if (subscribed && !this.peers.has(event.detail.peerId)) {
            await this.onTopicSubscribedPeer(event.detail.peerId);
        } else if (!subscribed && this.peers.has(event.detail.peerId)) {
            await this.removePeer(event.detail.peerId);
        }
    }

    private async onTopicSubscribedPeer(peerId: PeerId): Promise<void> {
        if (!this.peers.has(peerId) && await this.runAuthFetch(peerId)) {
            debug("ipdw:peer:adding", this.node.peerId.toString(), peerId.toString());
            this.peers.add(peerId);
            this.events.dispatchTypedEvent('peer:added', new TypedCustomEvent('peer:added', {detail: {peerId}}));
            await this.runSyncProtocol(peerId).catch(console.error);
        }
    }

    private async runAuthFetch(peerId: PeerId): Promise<boolean> {
        const challenge = Date.now().toString();
        const signature = await this.node.services.fetch.fetch(peerId, this.authFetchPath + challenge);
        if (!signature) return false;

        const payload = [new Uint8Array(Buffer.from(challenge)), peerId.publicKey!];
        return CryptoUtils.Verify(this.publicKey, Buffer.from(signature), Buffer.from(ArrayUtils.Uint8ArrayMarshal(payload)));
    }

    private async onAuthFetch(path: string): Promise<Uint8Array> {
        const challenge = path.slice(this.authFetchPath.length);
        const payload = [new Uint8Array(Buffer.from(challenge)), this.node.peerId.publicKey!];
        return await CryptoUtils.Sign(this.privateKey, Buffer.from(ArrayUtils.Uint8ArrayMarshal(payload)));
    }

    private async runSyncProtocol(peerId: PeerId): Promise<void> {
        try {
            this.events.dispatchTypedEvent('peer:syncing', new TypedCustomEvent('peer:syncing', {detail: {peerId, type: 'OUT' as 'OUT'}}));

            const stream = await this.node.dialProtocol(peerId, this.syncProtocolName, {runOnTransientConnection: true});

            await stream.sink([Y.encodeStateVector(this.crdtDoc)]);
            const stateRes = await stream.source.next();

            if (!stateRes.done) {
                const remoteStateVector = stateRes.value.subarray();
                await stream.sink([Y.encodeStateAsUpdate(this.crdtDoc, remoteStateVector)]);
            }

            this.events.dispatchTypedEvent('peer:synced', new TypedCustomEvent('peer:synced', {detail: {peerId, type: 'OUT' as 'OUT'}}));
        } catch (e: any) {
            console.error('Dial failed on peer', peerId.toString(), e);
            await this.removePeer(peerId);
        }
    }

    private async onSyncProtocol(data: IncomingStreamData): Promise<void> {
        try {
            this.events.dispatchTypedEvent('peer:syncing', new TypedCustomEvent('peer:syncing', {detail: {peerId: data.connection.remotePeer, type: 'IN' as 'IN'}}));

            const stream = data.stream;
            const stateRes = await stream.source.next();

            if (!stateRes.done) {
                const remoteStateVector = stateRes.value.subarray();

                if (!ArrayUtils.Uint8ArrayEquals(remoteStateVector, Y.encodeStateVector(this.crdtDoc))) {
                    await stream.sink([Y.encodeStateVector(this.crdtDoc)]);
                    const updateRes = await stream.source.next();

                    if (!updateRes.done) {
                        const remoteUpdateVector = updateRes.value.subarray();
                        Y.applyUpdate(this.crdtDoc, remoteUpdateVector);
                    }
                    await stream.close();
                }
            }

            this.events.dispatchTypedEvent('peer:synced', new TypedCustomEvent('peer:synced', {detail: {peerId: data.connection.remotePeer, type: 'IN' as 'IN'}}));
        } catch (e) {
            console.error('Connection failed on peer', data.connection.remotePeer.toString(), e);
            await this.removePeer(data.connection.remotePeer);
        }
    }

    private async removePeer(peerId: PeerId): Promise<void> {
        debug("ipdw:peer:removing", this.node.peerId.toString(), peerId.toString());
        this.peers.delete(peerId);
        await this.node.hangUp(peerId);
        this.events.dispatchTypedEvent('peer:removed', new TypedCustomEvent('peer:removed', {detail: {peerId}}));
    }
}

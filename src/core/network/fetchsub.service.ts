import type {Libp2p, PubSub} from "@libp2p/interface";
import * as raw from "multiformats/codecs/raw";
import {sha256} from "multiformats/hashes/sha2";
import {CID} from "multiformats/cid";
import {PeerId} from "@libp2p/interface/src/peer-id";
import {Fetch} from "@libp2p/fetch";
import {ArrayUtils} from "../../utils";
import {PeerRecord, RecordEnvelope} from "@libp2p/peer-record";

export class FetchsubService {
    private node: Libp2p<{ pubsub: PubSub, fetch: Fetch }>;

    private subscriptions: { [cid: string]: boolean; } = {};
    private listeners: { [cid: string]: (peer: PeerId) => Promise<void>; } = {}; //TODO: Support multiple listeners
    private subscribers: { [cid: string]: PeerId[]; } = {};

    private readonly subscribersFetchPathPrefix = '/tracker/subscribers/1.0.0/';

    constructor(node: Libp2p<{ pubsub: PubSub, fetch: Fetch }>) {
        this.node = node;
    }

    public async subscribe(topic: string): Promise<void> {
        const cid = CID.create(1, raw.code, await sha256.digest(raw.encode(new TextEncoder().encode(topic))));

        this.subscriptions[cid.toString()] = true;
    }

    public async unsubscribe(topic: string): Promise<void> {
        const cid = CID.create(1, raw.code, await sha256.digest(raw.encode(new TextEncoder().encode(topic))));
        delete this.subscriptions[cid.toString()];
    }

    public registerHandleFetchSubscribers() {
        this.node.services.fetch.registerLookupFunction(this.subscribersFetchPathPrefix, async (key: string) => {
            const topic = key.slice(this.subscribersFetchPathPrefix.length);
            const peers = await Promise.all(this.node.services.pubsub.getSubscribers(topic).map(p => this.node.peerStore.get(p)));
            const peerRecordEnvelopes = await Promise.all(peers.map(p => RecordEnvelope.seal(new PeerRecord({peerId: p.id, multiaddrs: p.addresses.map(a => a.multiaddr)}), this.node.peerId)));
            const peersRecordEnvelopesData = peerRecordEnvelopes.map(pre => pre.marshal());
            return ArrayUtils.Uint8ArrayMarshal(peersRecordEnvelopesData);
        });
    }

    public unregisterHandleFetchSubscribers() {
        this.node.services.fetch.unregisterLookupFunction(this.subscribersFetchPathPrefix);
    }

    public async fetchSubscribers(peerId: PeerId, topic: string): Promise<PeerId[]> {
        let peersFetchData;
        try {
            peersFetchData = await this.node.services.fetch.fetch(peerId, this.subscribersFetchPathPrefix + topic);
        } catch (e) {
            console.log(e)
        }

        if (!peersFetchData)
            return [];

        const peersRecordEnvelopesData = ArrayUtils.Uint8ArrayUnmarshal(peersFetchData);

        let peers: PeerId[] = [];
        for (const pred of peersRecordEnvelopesData) {
            await this.node.peerStore.consumePeerRecord(pred);

            const peerRecordEnvelope = await RecordEnvelope.openAndCertify(pred, PeerRecord.DOMAIN);
            const peerRecord = PeerRecord.createFromProtobuf(peerRecordEnvelope.payload);

            peers.push(peerRecord.peerId);
        }
        return peers;
    }

    public async setSubscriptionListener(topic: string, listener: (peer: PeerId) => Promise<any>): Promise<void> {
        const cid = CID.create(1, raw.code, await sha256.digest(raw.encode(new TextEncoder().encode(topic))));

        this.listeners[cid.toString()] = listener;

        if (!this.subscribers[cid.toString()]) {
            this.subscribers[cid.toString()] = [];

            // This should be removed on unsubscribe
            this.node.addEventListener('connection:open', async (event) => {
                // When connection are transient it could be a problem
                if (event.detail.transient) return;
                const fetchedSubscribers = await this.fetchSubscribers(event.detail.remotePeer, topic);
                for (const fetchedSubscriber of fetchedSubscribers) {
                    if (!fetchedSubscriber.equals(this.node.peerId) && this.subscribers[cid.toString()].findIndex(p => p.equals(fetchedSubscriber)) === -1) {
                        console.log('swarm:found', this.node.peerId, fetchedSubscriber);
                        this.subscribers[cid.toString()].push(fetchedSubscriber);
                        await this.listeners[cid.toString()](fetchedSubscriber);
                    }
                }
            });

            this.node.addEventListener('connection:close', async (event) => {
                console.log('connection:close', event.detail)

                // This could be done better
                const index = this.subscribers[cid.toString()].findIndex(p => p.equals(event.detail.remotePeer));
                if (index !== -1)
                    this.subscribers[cid.toString()].splice(index, 1);
            });

            (async () => {
                while (this.listeners[cid.toString()]) {
                    console.log('swarm:searching');
                    for (const connectedPeer of this.node.getPeers()) {
                        const fetchedSubscribers = await this.fetchSubscribers(connectedPeer, topic);
                        for (const fetchedSubscriber of fetchedSubscribers) {
                            if (!fetchedSubscriber.equals(this.node.peerId) && this.subscribers[cid.toString()].findIndex(p => p.equals(fetchedSubscriber)) === -1) {
                                console.log('swarm:found', this.node.peerId, fetchedSubscriber);
                                this.subscribers[cid.toString()].push(fetchedSubscriber);
                                await this.listeners[cid.toString()](fetchedSubscriber);
                            }
                        }
                    }
                    if (this.listeners[cid.toString()])
                        await new Promise(r => setTimeout(r, 15 * 1000)); // Refresh TTL in DHT
                }
            })().then();
        }
    }

    public async removeSubscriptionListener(topic: string): Promise<void> {
        const cid = CID.create(1, raw.code, await sha256.digest(raw.encode(new TextEncoder().encode(topic))));
        delete this.listeners[cid.toString()];
        delete this.subscribers[cid.toString()];
    }

    public async getSubscribers(topic: string): Promise<PeerId[]> {
        const cid = CID.create(1, raw.code, await sha256.digest(raw.encode(new TextEncoder().encode(topic))));
        return this.subscribers[cid.toString()] || [];
    }

}

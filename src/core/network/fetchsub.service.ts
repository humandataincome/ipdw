import type {Connection, Libp2p, PubSub} from "@libp2p/interface";
import {PeerId} from "@libp2p/interface/src/peer-id";
import {Fetch} from "@libp2p/fetch";
import {ArrayUtils} from "../../utils";
import {PeerRecord, RecordEnvelope} from "@libp2p/peer-record";

import Debug from "debug";

const debug = Debug('ipdw:fetchsub');

type ListenerFunction = (type: 'found', peer: PeerId) => Promise<void>;

export class FetchsubService {
    private readonly node: Libp2p<{ pubsub: PubSub; fetch: Fetch }>;
    private readonly listeners: Map<string, Set<ListenerFunction>> = new Map();
    private running = false;
    private readonly subscribersFetchPathPrefix = '/tracker/subscribers/1.0.0/';
    private readonly pullInterval = 30 * 1000;

    constructor(node: Libp2p<{ pubsub: PubSub; fetch: Fetch }>) {
        this.node = node;
        this.registerHandleFetchSubscribers();
        this.run();
    }

    public run(): void {
        if (this.running) return;
        this.running = true;

        this.node.addEventListener('connection:open', this.onConnectionOpen);
        this.startPullingSubscribers().then();
    }

    public stop(): void {
        this.running = false;
        this.node.removeEventListener('connection:open', this.onConnectionOpen);
    }

    public subscribe(topic: string): void {
        this.node.services.pubsub.subscribe(topic);
    }

    public unsubscribe(topic: string): void {
        this.node.services.pubsub.unsubscribe(topic);
    }

    public unregisterHandleFetchSubscribers(): void {
        this.node.services.fetch.unregisterLookupFunction(this.subscribersFetchPathPrefix);
    }

    public async addSubscriptionListener(topic: string, listener: ListenerFunction): Promise<void> {
        if (!this.listeners.has(topic)) {
            this.listeners.set(topic, new Set());
        }
        this.listeners.get(topic)!.add(listener);
    }

    public async removeSubscriptionListener(topic: string, listener: ListenerFunction): Promise<void> {
        const topicListeners = this.listeners.get(topic);
        if (topicListeners) {
            topicListeners.delete(listener);
            if (topicListeners.size === 0) {
                this.listeners.delete(topic);
            }
        }
    }

    public async getSubscribers(topic: string): Promise<PeerId[]> {
        return this.node.services.pubsub.getSubscribers(topic);
    }

    private onConnectionOpen = async (event: CustomEvent<Connection>): Promise<void> => {
        if (event.detail.transient) return;

        for (const topic of this.listeners.keys()) {
            await this.pullSubscribers(topic, event.detail.remotePeer);
        }
    }

    private async startPullingSubscribers(): Promise<void> {
        while (this.running) {
            for (const connectedPeer of this.node.getPeers()) {
                for (const topic of this.listeners.keys()) {
                    if (!this.running) return;
                    await this.pullSubscribers(topic, connectedPeer);
                }
            }
            if (!this.running) return;
            await new Promise(r => setTimeout(r, this.pullInterval));
        }
    }

    private async pullSubscribers(topic: string, peerId: PeerId): Promise<void> {
        const fetchedSubscribers = await this.fetchSubscribers(topic, peerId);
        const currentSubscribers = new Set(this.node.services.pubsub.getSubscribers(topic).map(p => p.toString()));

        for (const fetchedSubscriber of fetchedSubscribers) {
            if (!fetchedSubscriber.equals(this.node.peerId) && !currentSubscribers.has(fetchedSubscriber.toString())) {
                debug('fetchsub:found', this.node.peerId.toString(), fetchedSubscriber.toString());

                const listeners = this.listeners.get(topic);
                if (listeners) {
                    for (const listener of listeners) {
                        await listener('found', fetchedSubscriber);
                    }
                }
            }
        }
    }

    private registerHandleFetchSubscribers(): void {
        this.node.services.fetch.registerLookupFunction(this.subscribersFetchPathPrefix, async (key: string) => {
            const topic = key.slice(this.subscribersFetchPathPrefix.length);
            const peers = await Promise.all(this.node.services.pubsub.getSubscribers(topic).map(p => this.node.peerStore.get(p)));
            const peerRecordEnvelopes = await Promise.all(peers.map(p =>
                RecordEnvelope.seal(new PeerRecord({
                    peerId: p.id,
                    multiaddrs: p.addresses.map(a => a.multiaddr)
                }), this.node.peerId)
            ));
            const peersRecordEnvelopesData = peerRecordEnvelopes.map(pre => pre.marshal());
            return ArrayUtils.Uint8ArrayMarshal(peersRecordEnvelopesData);
        });
    }

    private async fetchSubscribers(topic: string, peerId: PeerId): Promise<PeerId[]> {
        try {
            const peersFetchData = await this.node.services.fetch.fetch(peerId, this.subscribersFetchPathPrefix + topic);
            if (!peersFetchData) return [];

            const peersRecordEnvelopesData = ArrayUtils.Uint8ArrayUnmarshal(peersFetchData);
            const peers: PeerId[] = [];

            for (const pred of peersRecordEnvelopesData) {
                await this.node.peerStore.consumePeerRecord(pred);
                const peerRecordEnvelope = await RecordEnvelope.openAndCertify(pred, PeerRecord.DOMAIN);
                const peerRecord = PeerRecord.createFromProtobuf(peerRecordEnvelope.payload);
                peers.push(peerRecord.peerId);
            }

            return peers;
        } catch (e) {
            console.error('Error fetching subscribers:', e);
            return [];
        }
    }
}

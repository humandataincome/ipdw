import type {Connection, Libp2p, PubSub} from "@libp2p/interface";
import {PeerId} from "@libp2p/interface/src/peer-id";
import {Fetch} from "@libp2p/fetch";
import {ArrayUtils} from "../../utils";
import {PeerRecord, RecordEnvelope} from "@libp2p/peer-record";


export class FetchsubService {
    private node: Libp2p<{ pubsub: PubSub, fetch: Fetch }>;
    private listeners: { [topic: string]: ((type: 'found', peer: PeerId) => Promise<void>)[]; } = {};
    private running = false;

    private readonly subscribersFetchPathPrefix = '/tracker/subscribers/1.0.0/';

    constructor(node: Libp2p<{ pubsub: PubSub, fetch: Fetch }>) {
        this.node = node;
        this.registerHandleFetchSubscribers();
        this.run();
    }

    public run(): void {
        if (this.running)
            return;

        this.node.addEventListener('connection:open', this.onConnectionOpen.bind(this));

        (async () => {
            while (true) {
                for (const connectedPeer of this.node.getPeers())
                    for (const topic of Object.keys(this.listeners)) {
                        if (!this.running) return

                        await this.pullSubscribers(topic, connectedPeer);
                    }

                if (!this.running) return

                await new Promise(r => setTimeout(r, 15 * 1000));
            }
        })().then();
    }

    public stop(): void {
        this.running = false;
        this.node.removeEventListener('connection:open', this.onConnectionOpen.bind(this))
    }

    public subscribe(topic: string): void {
        this.node.services.pubsub.subscribe(topic);
    }

    public unsubscribe(topic: string): void {
        this.node.services.pubsub.unsubscribe(topic);
    }

    public unregisterHandleFetchSubscribers() {
        this.node.services.fetch.unregisterLookupFunction(this.subscribersFetchPathPrefix);
    }

    public async addSubscriptionListener(topic: string, listener: (type: 'found', peer: PeerId) => Promise<any>): Promise<void> {
        if (!(topic in this.listeners))
            this.listeners[topic] = [];

        this.listeners[topic].push(listener);
    }

    public async removeSubscriptionListener(topic: string, listener: (type: 'found', peer: PeerId) => Promise<void>): Promise<void> {
        const listeners = this.listeners[topic];
        listeners.splice(listeners.indexOf(listener))

        if (this.listeners[topic].length === 0) {
            delete this.listeners[topic];
        }
    }

    public async getSubscribers(topic: string): Promise<PeerId[]> {
        return this.node.services.pubsub.getSubscribers(topic);
    }

    private async onConnectionOpen(event: CustomEvent<Connection>): Promise<void> {
        if (event.detail.transient) // When connection is transient it could be a problem
            return;

        for (const topic of Object.keys(this.listeners))
            await this.pullSubscribers(topic, event.detail.remotePeer);
    }

    private async pullSubscribers(topic: string, peerId: PeerId): Promise<void> {
        const fetchedSubscribers = await this.fetchSubscribers(topic, peerId);
        for (const fetchedSubscriber of fetchedSubscribers) {
            if (!fetchedSubscriber.equals(this.node.peerId) && this.node.services.pubsub.getSubscribers(topic).findIndex(p => p.equals(fetchedSubscriber)) === -1) {
                console.log('fetchsub:found', this.node.peerId, fetchedSubscriber);

                for (const listener of this.listeners[topic])
                    await listener('found', fetchedSubscriber);
            }
        }
    }

    private registerHandleFetchSubscribers() {
        this.node.services.fetch.registerLookupFunction(this.subscribersFetchPathPrefix, async (key: string) => {
            const topic = key.slice(this.subscribersFetchPathPrefix.length);
            const peers = await Promise.all(this.node.services.pubsub.getSubscribers(topic).map(p => this.node.peerStore.get(p)));
            const peerRecordEnvelopes = await Promise.all(peers.map(p => RecordEnvelope.seal(new PeerRecord({peerId: p.id, multiaddrs: p.addresses.map(a => a.multiaddr)}), this.node.peerId)));
            const peersRecordEnvelopesData = peerRecordEnvelopes.map(pre => pre.marshal());
            return ArrayUtils.Uint8ArrayMarshal(peersRecordEnvelopesData);
        });
    }

    private async fetchSubscribers(topic: string, peerId: PeerId): Promise<PeerId[]> {
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

}

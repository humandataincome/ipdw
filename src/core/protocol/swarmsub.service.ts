/*
   TODO: FINISH
    Implement DHT querying to find peers interested in topics.
    Handle subscription requests from peers.
    Handle message sending to subscribed peers.
    Optionally partition sorted subscribers in x chunks of len y with a given shift and send message to first of chunk and then instruct him tro propagate to next y-1
 */

/*
    SwarmSub (aka DHTSub)
 */
import type {Libp2p} from "@libp2p/interface";
import {KadDHT} from "@libp2p/kad-dht";
import * as raw from "multiformats/codecs/raw";
import {sha256} from "multiformats/hashes/sha2";
import {CID} from "multiformats/cid";
import {PeerId} from "@libp2p/interface/src/peer-id";
import {Fetch} from "@libp2p/fetch";
import {ArrayUtils} from "../../utils";
import {PeerRecord, RecordEnvelope} from "@libp2p/peer-record";

export class SwarmsubService {
    private node: Libp2p<{ dht: KadDHT, fetch: Fetch }>;

    private subscriptions: { [cid: string]: boolean; } = {};
    private listeners: { [cid: string]: (peer: PeerId) => Promise<void>; } = {}; //TODO: Support multiple listeners
    private subscribers: { [cid: string]: PeerId[]; } = {};

    // Need to handle unsubscription from providers using ttl

    constructor(node: Libp2p<{ dht: KadDHT, fetch: Fetch }>) {
        this.node = node;
    }

    public async subscribe(topic: string): Promise<void> {
        const cid = CID.create(1, raw.code, await sha256.digest(raw.encode(new TextEncoder().encode(topic))));

        this.subscriptions[cid.toString()] = true;

        /*
        (async () => {
            while (this.subscriptions[cid.toString()]) {
                try {
                    for await (const event of this.node.services.dht.provide(cid, {useCache: false, useNetwork: true})) {
                        //console.log('swarm:provide', this.node.peerId, event);

                        if (!this.subscriptions[cid.toString()])
                            break;
                    }
                } catch (e) {
                    //console.log('swarm:provide:error', e);
                }
                if (this.subscriptions[cid.toString()])
                    await new Promise(r => setTimeout(r, 30 * 1000)); // Refresh TTL in DHT
            }
        })().then();
         */
    }

    public async unsubscribe(topic: string): Promise<void> {
        const cid = CID.create(1, raw.code, await sha256.digest(raw.encode(new TextEncoder().encode(topic))));
        delete this.subscriptions[cid.toString()];
    }

    public async fetchSubscribers(peerId: PeerId, topic: string): Promise<PeerId[]> {
        let peersFetchData;
        try {
            peersFetchData = await this.node.services.fetch.fetch(peerId, `/tracker/subscribers/${topic}`);
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

            //This should be removed on unsubscribe
            this.node.addEventListener('connection:open', async (event) => {
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

            (async () => {
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
            })().then();
        }

        // Show logs and also hook sendrequest function
        // Ideally send dht query always to bootstrap
        // The main suspect is that in the actual state dht is not resilient
        // It is somehow bypassing bootstrap because the actual peer discovered unavailable peers
        // Also arbitrer could be the suspect in kbucket, but I think no
        // We need also to purge last seen contacts
        // Or create a swarm dht service with similar logic from scratch
        // DOUBLE CHECK YAMUX when running the query

        /*
        (async () => {
            while (this.listeners[cid.toString()]) {
                try {
                    for await (const event of this.node.services.dht.findProviders(cid, {useCache: false, useNetwork: true})) {
                        //console.log('swarm:find', this.node.peerId, event);

                        if (!this.listeners[cid.toString()])
                            break;

                        if (event.name === 'PROVIDER' && event.providers.length > 0) {
                            for (const peer of event.providers) {
                                if (!peer.id.equals(this.node.peerId) && this.subscribers[cid.toString()].findIndex(p => p.equals(peer.id)) === -1) {
                                    console.log('swarm:found', this.node.peerId, peer.id);
                                    this.subscribers[cid.toString()].push(peer.id);
                                    await this.listeners[cid.toString()](peer.id);
                                }
                            }
                        }
                    }

                } catch (e) {
                    //console.log('swarm:find:error', e);
                }
                if (this.listeners[cid.toString()])
                    await new Promise(r => setTimeout(r, 30 * 1000)); // Refresh TTL in DHT
            }
        })().then();
        */

        //await this.node.services.dht.refreshRoutingTable();
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

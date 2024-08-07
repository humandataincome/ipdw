import type {Libp2p} from "@libp2p/interface";
import {KadDHT} from "@libp2p/kad-dht";
import * as raw from "multiformats/codecs/raw";
import {sha256} from "multiformats/hashes/sha2";
import {CID} from "multiformats/cid";
import {PeerId} from "@libp2p/interface/src/peer-id";

type ListenerFunction = (type: 'found', peer: PeerId) => Promise<void>;

export class SwarmsubService {
    private readonly node: Libp2p<{ dht: KadDHT }>;
    private readonly listeners: Map<string, Set<ListenerFunction>> = new Map();
    private readonly subscribers: Map<string, Set<PeerId>> = new Map();
    private readonly subscriptions: Set<string> = new Set();
    private readonly provideInterval = 30 * 1000;
    private readonly findProvidersInterval = 30 * 1000;
    private running = false;

    constructor(node: Libp2p<{ dht: KadDHT }>) {
        this.node = node;
    }

    public run(): void {
        if (this.running) return;
        this.running = true;
        this.startProviding().then();
        this.startFinding().then();
    }

    public stop(): void {
        this.running = false;
    }

    public async subscribe(topic: string): Promise<void> {
        const cid = await this.topicToCid(topic);
        const cidStr = cid.toString();
        this.subscriptions.add(cidStr);
        if (!this.subscribers.has(cidStr)) {
            this.subscribers.set(cidStr, new Set());
        }
    }

    public async unsubscribe(topic: string): Promise<void> {
        const cid = await this.topicToCid(topic);
        const cidStr = cid.toString();
        this.subscriptions.delete(cidStr);
        this.subscribers.delete(cidStr);
    }

    public async addSubscriptionListener(topic: string, listener: ListenerFunction): Promise<void> {
        const cid = await this.topicToCid(topic);
        const cidStr = cid.toString();
        if (!this.listeners.has(cidStr)) {
            this.listeners.set(cidStr, new Set());
        }
        this.listeners.get(cidStr)!.add(listener);
    }

    public async removeSubscriptionListener(topic: string, listener: ListenerFunction): Promise<void> {
        const cid = await this.topicToCid(topic);
        const cidStr = cid.toString();
        const topicListeners = this.listeners.get(cidStr);
        if (topicListeners) {
            topicListeners.delete(listener);
            if (topicListeners.size === 0) {
                this.listeners.delete(cidStr);
            }
        }
    }

    public async getSubscribers(topic: string): Promise<PeerId[]> {
        const cid = await this.topicToCid(topic);
        const subscriberStrings = this.subscribers.get(cid.toString()) || new Set();
        return Array.from(subscriberStrings).map(s => s);
    }

    private async topicToCid(topic: string): Promise<CID> {
        return CID.create(1, raw.code, await sha256.digest(raw.encode(new TextEncoder().encode(topic))));
    }

    private async startProviding(): Promise<void> {
        while (this.running) {
            for (const cidStr of this.subscriptions) {
                if (!this.running) return;
                await this.provide(CID.parse(cidStr));
            }
            if (!this.running) return;
            await new Promise(r => setTimeout(r, this.provideInterval));
        }
    }

    private async startFinding(): Promise<void> {
        while (this.running) {
            for (const cidStr of this.listeners.keys()) {
                if (!this.running) return;
                await this.findProviders(CID.parse(cidStr));
            }
            if (!this.running) return;
            await new Promise(r => setTimeout(r, this.findProvidersInterval));
        }
    }

    private async provide(cid: CID): Promise<void> {
        try {
            for await (const event of this.node.services.dht.provide(cid, {useCache: false, useNetwork: true})) {
                if (!this.running) break;
            }
        } catch (e) {
            console.error('Error in provide:', e);
        }
    }

    private async findProviders(cid: CID): Promise<void> {
        try {
            for await (const event of this.node.services.dht.findProviders(cid, {useCache: false, useNetwork: true})) {
                if (!this.running) break;

                if (event.name === 'PROVIDER' && event.providers.length > 0) {
                    for (const peer of event.providers) {
                        if (!peer.id.equals(this.node.peerId) && !this.subscribers.get(cid.toString())?.has(peer.id)) {
                            console.log('swarm:found', this.node.peerId.toString(), peer.id.toString());
                            this.subscribers.get(cid.toString())?.add(peer.id);

                            const listeners = this.listeners.get(cid.toString());
                            if (listeners) {
                                for (const listener of listeners) {
                                    await listener('found', peer.id);
                                }
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.error('Error in findProviders:', e);
        }
    }
}

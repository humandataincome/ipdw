import * as Libp2p from 'libp2p';
import {noise} from '@chainsafe/libp2p-noise';
import {yamux} from "@chainsafe/libp2p-yamux";
import {mplex} from "@libp2p/mplex";
import {webRTC, webRTCDirect} from "@libp2p/webrtc";
import {webSockets} from "@libp2p/websockets";
import * as filters from "@libp2p/websockets/filters";
import {gossipsub} from '@chainsafe/libp2p-gossipsub';
import {dcutr} from '@libp2p/dcutr';
import {identify} from '@libp2p/identify';
import {circuitRelayServer, circuitRelayTransport} from "@libp2p/circuit-relay-v2";
import {bootstrap} from '@libp2p/bootstrap';
import type {PubSub} from '@libp2p/interface';
import {autoNAT} from '@libp2p/autonat';
import {KadDHT, kadDHT} from '@libp2p/kad-dht';
import {ping} from '@libp2p/ping';
import {webTransport} from '@libp2p/webtransport';
import {tcp} from "@libp2p/tcp";
import {uPnPNAT} from '@libp2p/upnp-nat';
import {Fetch, fetch} from "@libp2p/fetch";
import {mdns} from "@libp2p/mdns";
import * as libp2pInfo from 'libp2p/version';

export class Libp2pFactory {
    private static readonly PROTOCOL_PREFIX = 'ipdw';
    private static readonly DHT_PROTOCOL = '/ipdw/dht/1.0.0';
    //private static readonly BOOTSTRAP_ADDR = '/dns4/bootstrap.ipdw.tech/tcp/4001/p2p/12D3KooWCctszqqsrdcmuh151GTsKAHTaCg8Jor9mUbTHjkEaA7S';
    private static readonly BOOTSTRAP_ADDR = '/dns4/bootstrap.ipdw.tech/tcp/4002/ws/p2p/12D3KooWCctszqqsrdcmuh151GTsKAHTaCg8Jor9mUbTHjkEaA7S';

    public static async create(): Promise<Libp2p.Libp2p<{ pubsub: PubSub, dht: KadDHT, fetch: Fetch }>> {
        const isWeb = typeof window === 'object' || typeof importScripts === 'function';
        const nodeOptions = isWeb ? await this.libp2pWebOptions() : await this.libp2pNodeOptions();

        const node = await Libp2p.createLibp2p(nodeOptions);

        this.setupEventListeners(node);
        console.log('p2p:started', node.peerId.toString(), node.getMultiaddrs().map(ma => ma.toString()));

        return node as any;
    }

    private static setupEventListeners(node: Libp2p.Libp2p): void {
        const events = ['connection:open', 'connection:close', 'peer:connect', 'peer:discovery'];
        events.forEach((event: any) => {
            node.addEventListener(event, (e) => {
                console.log(event, node.peerId.toString(), e.detail);
            });
        });
    }

    private static getCommonOptions(): Partial<Libp2p.Libp2pOptions> {
        return {
            connectionEncryption: [noise()],
            streamMuxers: [yamux(), mplex()],
            peerDiscovery: [
                bootstrap({
                    list: [this.BOOTSTRAP_ADDR]
                }),
            ],
            services: {
                identify: identify({
                    protocolPrefix: this.PROTOCOL_PREFIX,
                    agentVersion: this.getAgentVersion()
                }),
                dht: kadDHT({
                    protocol: this.DHT_PROTOCOL,
                    clientMode: false,
                    kBucketSize: 256,
                    pingTimeout: 10000
                }),
                pubsub: gossipsub({allowPublishToZeroTopicPeers: true}),
                autoNAT: autoNAT(),
                dcutr: dcutr(),
                ping: ping({protocolPrefix: this.PROTOCOL_PREFIX}),
                fetch: fetch({protocolPrefix: this.PROTOCOL_PREFIX})
            },
            connectionManager: {
                minConnections: 1
            },
        };
    }

    private static async libp2pWebOptions(): Promise<Libp2p.Libp2pOptions> {
        console.log('p2p:configuring:web');

        return {
            ...this.getCommonOptions(),
            addresses: {
                listen: ['/webrtc']
            },
            transports: [
                circuitRelayTransport({discoverRelays: 1}),
                webSockets({filter: filters.all}),
                webRTC(),
                webRTCDirect(),
                ...(globalThis.WebTransport !== undefined ? [webTransport()] : []),
            ],
            connectionGater: {
                denyDialMultiaddr: () => false
            },
        };
    }

    private static async libp2pNodeOptions(): Promise<Libp2p.Libp2pOptions> {
        console.log('p2p:configuring:node');

        return {
            ...this.getCommonOptions(),
            addresses: {
                listen: [
                    '/ip4/0.0.0.0/tcp/0',
                    '/ip4/0.0.0.0/tcp/0/ws',
                    '/webrtc'
                ]
            },
            transports: [
                circuitRelayTransport({discoverRelays: 1}),
                tcp(),
                webRTC(),
                webRTCDirect(),
                webSockets({filter: filters.all}),
            ],
            peerDiscovery: [
                ...(this.getCommonOptions().peerDiscovery || []),
                mdns(),
            ],
            services: {
                ...this.getCommonOptions().services,
                upnp: uPnPNAT(),
                relay: circuitRelayServer()
            },
        };
    }

    private static getAgentVersion(): string {
        const platform = typeof process !== 'undefined' ? `node-${process.versions.node}` : globalThis.navigator.userAgent;
        return `ipdw/client/1.0.0 ${libp2pInfo.name}/${libp2pInfo.version} UserAgent=${platform}`;
    }
}

import * as Libp2p from 'libp2p';
import {noise} from '@chainsafe/libp2p-noise';
import {yamux} from "@chainsafe/libp2p-yamux";
import {mplex} from "@libp2p/mplex";
import {webRTC, webRTCDirect} from "@libp2p/webrtc";
import {webSockets} from "@libp2p/websockets";
import * as filters from "@libp2p/websockets/filters";
import {gossipsub} from '@chainsafe/libp2p-gossipsub';
import {dcutr} from '@libp2p/dcutr';
import {identify, identifyPush} from '@libp2p/identify';
import {circuitRelayServer, circuitRelayTransport} from "@libp2p/circuit-relay-v2";
import {bootstrap} from '@libp2p/bootstrap';
import type {PubSub} from '@libp2p/interface';
import {kadDHT, KadDHT} from '@libp2p/kad-dht';
import {ping} from '@libp2p/ping';
import {webTransport} from '@libp2p/webtransport';
import {tcp} from "@libp2p/tcp";
import {uPnPNAT} from '@libp2p/upnp-nat';
import {Fetch, fetch} from "@libp2p/fetch";
import {mdns} from "@libp2p/mdns";
import * as libp2pInfo from 'libp2p/version';
import {createEd25519PeerId, createFromProtobuf, exportToProtobuf} from '@libp2p/peer-id-factory';

import Debug from "debug";
import {IDBDatastore} from "datastore-idb";
import {FsDatastore} from "datastore-fs";
import {Key} from 'interface-datastore';
import {pubsubPeerDiscovery} from "@libp2p/pubsub-peer-discovery";

const debug = Debug('ipdw:libp2p');

const DATASTORE_ENABLED = false;
const REUSE_PEER_ENABLED = false;

export class Libp2pFactory {
    private static readonly PROTOCOL_PREFIX = 'ipdw';
    private static readonly DHT_PROTOCOL = '/ipdw/dht/1.0.0';
    private static readonly BOOTSTRAP_ADDRESSES = [
        '/dns4/bootstrap.ipdw.tech/tcp/4001/p2p/12D3KooWCctszqqsrdcmuh151GTsKAHTaCg8Jor9mUbTHjkEaA7S',
        '/dns4/bootstrap.ipdw.tech/tcp/4002/wss/p2p/12D3KooWCctszqqsrdcmuh151GTsKAHTaCg8Jor9mUbTHjkEaA7S',
        //'/ip4/127.0.0.1/tcp/4002/ws/p2p/12D3KooWFMZzQ58LCRvnsu6747nbKqzLU6TamaTBYYzdasLGAbKQ',
        //'/ip4/127.0.0.1/tcp/4001/p2p/12D3KooWFMZzQ58LCRvnsu6747nbKqzLU6TamaTBYYzdasLGAbKQ'
    ];

    public static async create(): Promise<Libp2p.Libp2p<{ pubsub: PubSub, dht: KadDHT, fetch: Fetch }>> {
        const isWeb = typeof window === 'object' || typeof importScripts === 'function';
        let nodeOptions = isWeb ? await this.libp2pWebOptions() : await this.libp2pNodeOptions();

        if (REUSE_PEER_ENABLED) {
            let metastore = isWeb ? new IDBDatastore('.datastore') : new FsDatastore('.datastore');
            await metastore.open();

            if (!await metastore.has(new Key('/peer-id')))
                await metastore.put(new Key('/peer-id'), exportToProtobuf(await createEd25519PeerId()));

            const peerId = await createFromProtobuf(await metastore.get(new Key('/peer-id')));
            await metastore.close();

            nodeOptions = {peerId, ...nodeOptions}
        }

        const node = await Libp2p.createLibp2p(nodeOptions);

        debug('p2p:started', node.peerId.toString(), node.getMultiaddrs().map(ma => ma.toString()));

        return node as any;
    }

    private static getCommonOptions(): Partial<Libp2p.Libp2pOptions> {
        return {
            connectionEncryption: [noise()],
            streamMuxers: [yamux(), mplex()],
            peerDiscovery: [
                bootstrap({
                    list: this.BOOTSTRAP_ADDRESSES
                }),
                pubsubPeerDiscovery({topics: ['_peer-discovery._ipdw._pubsub']}),
            ],
            services: {
                identify: identify({protocolPrefix: this.PROTOCOL_PREFIX, agentVersion: this.getAgentVersion()}),
                identifyPush: identifyPush({protocolPrefix: this.PROTOCOL_PREFIX, agentVersion: this.getAgentVersion()}),
                dht: kadDHT({protocol: this.DHT_PROTOCOL, clientMode: true}),
                pubsub: gossipsub({allowPublishToZeroTopicPeers: true}),
                //autoNAT: autoNAT(),
                dcutr: dcutr(),
                ping: ping({protocolPrefix: this.PROTOCOL_PREFIX}),
                fetch: fetch({protocolPrefix: this.PROTOCOL_PREFIX})
            },
            connectionManager: {
                minConnections: 1,
            },
            connectionGater: {
                //denyDialMultiaddr: () => false // Enable for local testing
            },
        };
    }

    private static async libp2pWebOptions(): Promise<Libp2p.Libp2pOptions> {
        debug('p2p:configuring:web');

        const commonOptions = this.getCommonOptions();

        return {
            ...commonOptions,
            ...(DATASTORE_ENABLED ? {
                datastore: await (async () => {
                    const d = new IDBDatastore('.datastore');
                    await d.open();
                    return d;
                })()
            } : {}),
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
        };
    }

    private static async libp2pNodeOptions(): Promise<Libp2p.Libp2pOptions> {
        debug('p2p:configuring:node');

        const commonOptions = this.getCommonOptions();

        return {
            ...commonOptions,
            ...(DATASTORE_ENABLED ? {
                datastore: await (async () => {
                    const d = new FsDatastore('.datastore');
                    await d.open();
                    return d;
                })()
            } : {}),
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
                ...(commonOptions.peerDiscovery || []),
                mdns(),
            ],
            services: {
                ...commonOptions.services,
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

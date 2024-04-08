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
import {circuitRelayTransport} from "@libp2p/circuit-relay-v2";
import {bootstrap} from '@libp2p/bootstrap';
import type {PubSub} from '@libp2p/interface';
import {autoNAT} from '@libp2p/autonat';
import {KadDHT, kadDHT, removePublicAddressesMapper} from '@libp2p/kad-dht';
import {ping} from '@libp2p/ping';
import {webTransport} from '@libp2p/webtransport';
import {tcp} from "@libp2p/tcp";
import {uPnPNAT} from '@libp2p/upnp-nat';
import {mdns} from "@libp2p/mdns";

export class Libp2pFactory {
    public static async create(): Promise<Libp2p.Libp2p<{ pubsub: PubSub, dht: KadDHT }>> {
        const node = await Libp2p.createLibp2p(typeof window === 'object' || typeof importScripts === 'function' ? this.libp2pWebOptions() : this.libp2pNodeOptions());

        node.addEventListener("connection:open", (event) => {
            console.log("connection:open", node.peerId, event.detail);
        })
        node.addEventListener("connection:close", (event) => {
            console.log("connection:close", node.peerId, event.detail);
        })
        node.addEventListener("self:peer:update", (event) => {
            console.log("self:peer:update", node.peerId, event.detail);
        })
        node.addEventListener("peer:discovery", (event) => {
            console.log("peer:discovery", node.peerId, event.detail);
        })
        console.log('p2p:started', node.peerId, node.getMultiaddrs());

        return node;
    }

    private static libp2pWebOptions() {
        console.log('p2p:configuring:web');
        return {
            addresses: {
                listen: [
                    '/webrtc',
                    "/wss",
                    "/ws"
                ]
            },
            transports: [
                circuitRelayTransport({
                    discoverRelays: 1
                }),
                webRTC(),
                webRTCDirect(),
                webSockets({
                    filter: filters.all
                }),
                webTransport(),
            ],
            connectionEncryption: [noise()],
            streamMuxers: [yamux(), mplex()],
            peerDiscovery: [
                bootstrap({
                    list: [
                        //'/ip4/127.0.0.1/tcp/4002/ws/p2p/12D3KooWFMZzQ58LCRvnsu6747nbKqzLU6TamaTBYYzdasLGAbKQ',
                        '/dns4/bootstrap.ipdw.tech/tcp/4002/wss/p2p/12D3KooWCctszqqsrdcmuh151GTsKAHTaCg8Jor9mUbTHjkEaA7S'
                    ]
                }),
            ],
            services: {
                identify: identify(),
                dht: kadDHT({
                    protocol: '/ipdw/dht/1.0.0',
                    peerInfoMapper: removePublicAddressesMapper,
                    clientMode: true
                }),
                pubsub: gossipsub(),
                autoNAT: autoNAT(),
                dcutr: dcutr(),
                ping: ping()
            },
            connectionManager: {
                minConnections: 1
            },
            connectionGater: {denyDialMultiaddr: async () => false},
        };
    }

    private static libp2pNodeOptions() {
        console.log('p2p:configuring:node');
        return {
            addresses: {
                listen: [
                    '/ip4/0.0.0.0/tcp/0',
                    '/ip4/0.0.0.0/tcp/0/ws',
                    '/webrtc'
                ]
            },
            transports: [
                circuitRelayTransport({
                    discoverRelays: 1
                }),
                tcp(),
                webRTC(),
                webRTCDirect(),
                webSockets({
                    filter: filters.all
                }),
            ],
            connectionEncryption: [noise()],
            streamMuxers: [yamux(), mplex()],
            peerDiscovery: [
                mdns(),
                bootstrap({
                    list: [
                        //'/ip4/127.0.0.1/tcp/4001/p2p/12D3KooWFMZzQ58LCRvnsu6747nbKqzLU6TamaTBYYzdasLGAbKQ',
                        '/dns4/bootstrap.ipdw.tech/tcp/4001/p2p/12D3KooWCctszqqsrdcmuh151GTsKAHTaCg8Jor9mUbTHjkEaA7S'
                    ]
                }),
            ],
            services: {
                identify: identify(),
                dht: kadDHT({
                    protocol: '/ipdw/dht/1.0.0',
                    peerInfoMapper: removePublicAddressesMapper,
                    clientMode: true
                }),
                pubsub: gossipsub(),
                autoNAT: autoNAT(),
                upnp: uPnPNAT(),
                dcutr: dcutr(),
                ping: ping()
            },
            connectionManager: {
                minConnections: 1
            }
        };
    }
}



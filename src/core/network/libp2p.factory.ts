import * as Libp2p from 'libp2p'
import {noise} from '@chainsafe/libp2p-noise'
import {yamux} from "@chainsafe/libp2p-yamux";
import {mplex} from "@libp2p/mplex";
import {webRTC} from "@libp2p/webrtc";
import {webSockets} from "@libp2p/websockets";
import * as filters from "@libp2p/websockets/filters";
import {GossipSub, gossipsub} from '@chainsafe/libp2p-gossipsub'
import {dcutr} from '@libp2p/dcutr'
import {identify} from '@libp2p/identify'
import {circuitRelayServer, circuitRelayTransport} from "@libp2p/circuit-relay-v2";
import {tcp} from "@libp2p/tcp";
import {pubsubPeerDiscovery} from '@libp2p/pubsub-peer-discovery';
import {mdns} from '@libp2p/mdns';

export default async function createLibp2p(): Promise<Libp2p.Libp2p<{ pubsub: GossipSub }>> {
    const node = await Libp2p.createLibp2p(typeof window === 'object' || typeof importScripts === 'function' ? createLibp2pWebOptions() : createLibp2pNodeOptions());

    node.addEventListener("connection:open", (event) => {
        //console.log("connection:open", node.peerId, event.detail);
    })
    node.addEventListener("connection:close", (event) => {
        //console.log("connection:close", node.peerId, event.detail);
    })
    node.addEventListener("self:peer:update", (event) => {
        //console.log("self:peer:update", node.peerId, event.detail);
    })
    node.addEventListener("peer:discovery", (event) => {
        //console.log("peer:discovery", node.peerId, event.detail);
        node.dial(event.detail.id).then();
    })

    return node as any;
}

function createLibp2pWebOptions() {
    console.log('Configuring p2p: Web')
    return {
        addresses: {
            listen: [
                '/webrtc'
            ]
        },
        transports: [
            webSockets({
                filter: filters.all
            }),
            webRTC(),
            circuitRelayTransport({
                discoverRelays: 1
            })
        ],
        connectionEncryption: [noise()],
        streamMuxers: [yamux(), mplex()],
        connectionGater: {
            denyDialMultiaddr: () => {
                return false
            }
        },
        peerDiscovery: [
            //TODO: Should set some boostrap nodes
            pubsubPeerDiscovery({
                topics: [
                    `ipdw._peer-discovery._p2p._pubsub`,
                    //'_peer-discovery._p2p._pubsub' // Include if you want to participate in the global space
                ]
            }),
            mdns()
        ],
        services: {
            identify: identify(),
            pubsub: gossipsub(),
            dcutr: dcutr()
        },
        connectionManager: {
            minConnections: 0
        }
    };
}

function createLibp2pNodeOptions() {
    console.log('Configuring p2p: Node')
    return {
        addresses: {
            listen: ['/ip4/0.0.0.0/tcp/0/ws', '/ip4/0.0.0.0/tcp/0']
        },
        transports: [
            webSockets({
                filter: filters.all
            }),
            tcp()
        ],
        connectionEncryption: [noise()],
        streamMuxers: [yamux(), mplex()],
        peerDiscovery: [
            //TODO: Should set some boostrap nodes
            pubsubPeerDiscovery({
                topics: [
                    `ipdw._peer-discovery._p2p._pubsub`,
                    //'_peer-discovery._p2p._pubsub' // Include if you want to participate in the global space
                ]
            }),
            mdns()
        ],
        services: {
            identify: identify(),
            relay: circuitRelayServer({
                reservations: {
                    maxReservations: Infinity
                }
            }),
            pubsub: gossipsub({fallbackToFloodsub: true, floodPublish: true, emitSelf: true}),
            dcutr: dcutr()
        },
        connectionManager: {
            minConnections: 0
        }
    };
}

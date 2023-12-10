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

export default async function createLibp2p(): Promise<Libp2p.Libp2p<{ pubsub: GossipSub }>> {
    const node = await Libp2p.createLibp2p(typeof window === 'object' || typeof importScripts === 'function' ? createLibp2pWebOptions() : createLibp2pNodeOptions());

    node.addEventListener("connection:open", (event) => {
        console.log("connection:open", event.detail);
    })
    node.addEventListener("connection:close", (event) => {
        console.log("connection:close", event.detail);
    })

    node.addEventListener("self:peer:update", (event) => {
        console.log("self:peer:update", event.detail);
    })

    node.addEventListener("peer:discovery", (event) => {
        console.log("peer:discovery", event.detail);
    })

    await node.handle('/ipdw/1.0.0', ({stream, connection}) => {
        console.log('handle /ipdw/1.0.0', stream);
    })
    return node as any;
}

function createLibp2pWebOptions(): any {
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
    return {
        addresses: {
            listen: ['/ip4/127.0.0.1/tcp/0/ws']
        },
        transports: [
            webSockets({
                filter: filters.all
            })
        ],
        connectionEncryption: [noise()],
        streamMuxers: [yamux(), mplex()],
        services: {
            identify: identify(),
            relay: circuitRelayServer({
                reservations: {
                    maxReservations: Infinity
                }
            }),
            pubsub: gossipsub(),
            dcutr: dcutr()
        },
        connectionManager: {
            minConnections: 0
        }
    };
}

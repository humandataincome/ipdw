import * as Libp2p from 'libp2p'
import {noise} from '@chainsafe/libp2p-noise'
import {tcp} from "@libp2p/tcp";
import {yamux} from "@chainsafe/libp2p-yamux";
import {mplex} from "@libp2p/mplex";
import {identifyService} from "libp2p/identify";
import {webRTC, webRTCDirect} from "@libp2p/webrtc";
import {webTransport} from "@libp2p/webtransport";
import {webSockets} from "@libp2p/websockets";
import * as filters from "@libp2p/websockets/filters";
import {circuitRelayTransport} from "libp2p/circuit-relay";
import {PubSub} from "@libp2p/interface-pubsub";
import { webRTCStar } from '@libp2p/webrtc-star';
import { gossipsub } from '@chainsafe/libp2p-gossipsub'

export default async function createLibp2p(): Promise<Libp2p.Libp2p<{pubsub: PubSub}>> {
    const node = await Libp2p.createLibp2p(typeof window === 'undefined' ? createLibp2pNodeOptions() : createLibp2pWebOptions());

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
    const webRtcStar = webRTCStar()
    return {
        addresses: {
            listen: [
                '/webrtc',
                '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/'
            ]
        },
        transports: [
            webRTC(),
            webRTCDirect(),
            webTransport(),
            webSockets({
                filter: filters.all,
            }),
            circuitRelayTransport({
                discoverRelays: 1
            }),
            webRtcStar.transport
        ],
        peerDiscovery: [
            webRtcStar.discovery,
        ],
        connectionEncryption: [
            noise()
        ],
        streamMuxers: [
            yamux(),
            mplex(),
        ],
        services: {
            identify: identifyService(),
            pubsub: gossipsub(),
        }
    };
}

function createLibp2pNodeOptions() {
    return {
        addresses: {
            listen: ['/ip4/0.0.0.0/tcp/0']
        },
        transports: [
            tcp()
        ],
        connectionEncryption: [
            noise()
        ],
        streamMuxers: [
            yamux(),
            mplex()
        ],
        services: {
            identify: identifyService(),
            pubsub: gossipsub(),
        }
    };
}

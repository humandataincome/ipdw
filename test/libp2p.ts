import {noise} from '@chainsafe/libp2p-noise'
import {yamux} from '@chainsafe/libp2p-yamux'
import {bootstrap} from '@libp2p/bootstrap'
import {identify} from '@libp2p/identify'
import {mplex} from '@libp2p/mplex'
import {tcp} from '@libp2p/tcp'
import {createLibp2p} from 'libp2p'
import {kadDHT, removePublicAddressesMapper} from "@libp2p/kad-dht";
import {CID} from "multiformats/cid";
import {EventTypes} from "@libp2p/kad-dht";
import * as json from "multiformats/codecs/json";
import {sha256} from "multiformats/hashes/sha2";
import {webSockets} from "@libp2p/websockets";
import {webRTC, webRTCDirect} from "@libp2p/webrtc";
import {circuitRelayTransport} from "@libp2p/circuit-relay-v2";
import {gossipsub} from "@chainsafe/libp2p-gossipsub";
import {dcutr} from "@libp2p/dcutr";
import {autoNAT} from "@libp2p/autonat";
import {uPnPNAT} from "@libp2p/upnp-nat";
import * as filters from '@libp2p/websockets/filters'
import {webTransport} from "@libp2p/webtransport";

const createNode = async () => {
    const config = {
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
            webTransport(),
            webSockets({filter: filters.all})
        ],
        connectionEncryption: [noise()],
        streamMuxers: [yamux(), mplex()],
        connectionGater: {
            denyDialMultiaddr: () => {
                return false
            }
        },
        peerDiscovery: [
            bootstrap({
                list: [
                    '/dns4/bootstrap.ipdw.tech/tcp/4001/p2p/12D3KooWCctszqqsrdcmuh151GTsKAHTaCg8Jor9mUbTHjkEaA7S'
                ]
            }),
        ],
        services: {
            identify: identify(),
            dht: kadDHT({
                protocol: '/ipdw/dht/1.0.0',
                peerInfoMapper: removePublicAddressesMapper,
                clientMode: false
            }),
            pubsub: gossipsub(),
            autoNAT: autoNAT(),
            upnp: uPnPNAT(),
            dcutr: dcutr(),
        },
        connectionManager: {
            minConnections: 1
        }
    }

    return await createLibp2p(config)
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runNode1() {
    const node = await createNode();
    node.addEventListener('peer:discovery', async (evt) => {
        console.log(`Peer ${node.peerId.toString()} discovered: ${evt.detail.id.toString()} [${evt.detail.multiaddrs.toString()}]`)
    })

    console.log('Node1 started %s', node.peerId);

    await delay(1000)

    const bytes = json.encode({topic: 'ipdw-1231231231'})
    const hash = await sha256.digest(bytes)
    const cid = CID.create(1, json.code, hash)

    async function loop() {
        try {
            const provideds = node.services.dht.provide(cid as any);

            //const provideds = node.services.dht.put(hash.bytes, bytes);
            for await (const event of provideds) {
                console.log('Provided:', node.peerId, event);
            }

            console.log('Node %s is providing %s', node.peerId, cid);

        } catch (e) {
            console.log(e);
            await loop();
        }
    }

    await loop();

    //const res = await node.contentRouting.put(cid.bytes, bytes);
    //console.log('providing', cid, res);
}

async function runNode2() {
    const node = await createNode();
    node.addEventListener('peer:discovery', (evt) => {
        console.log(`Peer ${node.peerId.toString()} discovered: ${evt.detail.id.toString()} [${evt.detail.multiaddrs}]`)
    });

    console.log('Node2 started %s', node.peerId);

    await delay(1000);

    const cid = CID.parse('bagaaieradysgndf3lwzeco2qpb2faahy7ttlvfthpxusibzty7hdbhfjl3uq');

    console.log('searching for', cid);

    async function loop() {
        try {

            const providers = node.services.dht.findProviders(cid as any);
            for await (const event of providers) {
                console.log(event)
                if (event.type === EventTypes.PEER_RESPONSE && event.name === 'PEER_RESPONSE' && event.providers.length > 0)
                    console.log('Found provider:', node.peerId, event);
            }
        } catch (e) {
            console.log(e);
            await loop();
        }
    }

    await loop();

    //const res = await node.contentRouting.get(cid.bytes);
    //console.log('found', cid, res);
}


async function main(): Promise<void> {
    await runNode1()
    await runNode2()
}

(async () => {
    await main();
})();
